/* eslint-disable no-restricted-syntax */
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize/types';
import { v4 as uuid } from 'uuid';
import { constants, dto, httpResponse, logger, sendGrid } from '../helpers';
import { ClassifiedResponseByUserIdAttributes, PaymentsAttributes, PayoutsBatchIdsAttributes } from '../interfaces';
import { financialDashboardService, paymentsService, paymentsTransitionsService, usersServices } from '../services';

const { emailTemplates } = constants;
/**
 * @description preparePayments is a controller used to prepare payments for users before releasing
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const preparePayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`preparePayments : started ,cron Job received`);

  const paymentsTransitionsFilter = dto.generalDTO.filterData({ status: constants.PENDING });
  logger.info(`preparePayments : paymentsTransitionsFilter ${JSON.stringify(paymentsTransitionsFilter)}`);

  const paymentsTransactions = await paymentsTransitionsService.getAllPaymentsTransactions(
    paymentsTransitionsFilter,
    transaction,
  );
  logger.info(`preparePayments : paymentsTransactions ${JSON.stringify(paymentsTransactions)}`);

  const pendingTransactions = paymentsTransactions.filter((result) => result.status === constants.PENDING);
  logger.info(`preparePayments : pendingTransactions ${JSON.stringify(pendingTransactions)}`);

  const classifiedResponseByUserId = pendingTransactions.reduce(
    (acc: ClassifiedResponseByUserIdAttributes, element) => {
      if (element.userId) {
        if (!acc[element.userId]) {
          acc[element.userId] = {
            [element.type]: element,
            closedOut: element.amount,
          };
        } else {
          acc[element.userId][element.type] = element;
          acc[element.userId].closedOut += element.amount;
        }
      }
      return acc;
    },
    {},
  );
  logger.info(`preparePayments : classifiedResponseByUserId ${JSON.stringify(classifiedResponseByUserId)}`);

  const users = await usersServices.findAllUsers();
  logger.info(`preparePayments : fetch all users from database to match response`);
  const usersObject = users.reduce((acc: any, user) => {
    if (user.id && !acc[user.id]) acc[user.id] = user;
    return acc;
  }, {});
  logger.info(`preparePayments : usersObject ${JSON.stringify(usersObject)}`);

  logger.info(`preparePayments : manipulate affiliate networks services response to fit payments service`);
  const paymentsDraftPayload: Array<PaymentsAttributes> = Object.keys(classifiedResponseByUserId)
    .filter(
      (key) =>
        classifiedResponseByUserId[key].closedOut >= 25 &&
        Object.keys(usersObject).find((userId) => userId === key && usersObject[userId].paypalAccount),
    )
    .map((element: string) => {
      return {
        userId: usersObject[element].id,
        closedOut: classifiedResponseByUserId[element].closedOut,
        paypalAccount: usersObject[element].paypalAccount,
        transactionId: uuid(),
      };
    });
  logger.info(`preparePayments : paymentsDraftPayload ${JSON.stringify(paymentsDraftPayload)}`);

  logger.info(`preparePayments : creat new payment records`);
  const paymentsData = await paymentsService.createBulkPayments(paymentsDraftPayload, transaction);
  logger.info(`preparePayments : paymentsData ${JSON.stringify(paymentsData)}`);

  for await (const { id, userId } of paymentsData) {
    const filter = dto.generalDTO.filterData({
      userId,
      status: constants.PENDING,
    });

    const data = {
      paymentId: id,
      status: constants.PREPARING,
    };

    await paymentsTransitionsService.updatePaymentsTransactions(filter, data, transaction);
  }

  logger.info(`preparePayments : ended`);

  await transaction.commit();
  return httpResponse.ok(response, paymentsData);
};

/**
 * @description sendPayments is a controller used to send payments
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const sendPayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const filter = dto.generalDTO.filterData({ status: constants.PENDING });

  logger.info(`sendPayments: get all pending  payments`);
  const pendingPayments = await await paymentsService.getAllPayments(filter, transaction);
  const { PaymentsWithPayPal, PaymentsWithoutPayPal } = pendingPayments.reduce(
    (acc: Record<string, Array<PaymentsAttributes>>, payment) => {
      if (payment.paypalAccount) acc.PaymentsWithPayPal.push(payment);
      else acc.PaymentsWithoutPayPal.push(payment);
      return acc;
    },
    {
      PaymentsWithPayPal: [] as Array<PaymentsAttributes>,
      PaymentsWithoutPayPal: [] as Array<PaymentsAttributes>,
    },
  );
  logger.info(`sendPayments: pending payments ${JSON.stringify(PaymentsWithPayPal)}`);

  logger.info(`sendPayments: convert data to paypal shape`);
  const payoutsReceiversData = await Promise.all(
    PaymentsWithPayPal.map(({ paypalAccount, closedOut, transactionId, id }) => {
      const updatePaymentsTransactionsFilter = dto.generalDTO.filterData({
        paymentId: id,
      });

      const data = {
        paymentId: id,
        status: constants.PROCESSING,
      };

      paymentsTransitionsService.updatePaymentsTransactions(updatePaymentsTransactionsFilter, data, transaction);
      return {
        recipient_type: 'EMAIL',
        amount: {
          value: closedOut,
          currency: 'USD',
        },
        receiver: paypalAccount,
        sender_item_id: transactionId || uuid(),
      };
    }),
  );
  logger.info(`sendPayments: PaymentsWithPayPal ${JSON.stringify(PaymentsWithPayPal)}`);

  const usersWithoutPayPal = PaymentsWithoutPayPal.map(({ userId, closedOut }) => ({ userId, closedOut }));
  const users = await usersServices.findAllUsers(transaction);
  const userWithoutPayPalRecords = users.filter((userRecord) =>
    usersWithoutPayPal.find(({ userId }) => userId === userRecord.id),
  );
  const usersWithoutPayPalDetails = userWithoutPayPalRecords.map(({ id, email }) => {
    const closedOut = usersWithoutPayPal.find(({ userId }) => userId === id)?.closedOut || 0;
    return {
      email,
      closedOut,
    };
  });

  // TODO: merge closedOut with each user
  await Promise.all(
    usersWithoutPayPalDetails.map(async ({ email, closedOut }) => {
      const emailDetails = {
        to: email,
        from: emailTemplates.completeProfile.from,
        subject: emailTemplates.completeProfile.subject,
        templateId: emailTemplates.completeProfile.templateId,
        dynamicTemplateData: {
          email,
          closedOut,
        },
      };
      await sendGrid.send(emailDetails);
    }),
  );
  await Promise.all(
    PaymentsWithPayPal.map(async ({ paypalAccount, closedOut }) => {
      const emailDetails = {
        to: paypalAccount,
        from: emailTemplates.gotCashCongrats.from,
        subject: emailTemplates.gotCashCongrats.subject,
        templateId: emailTemplates.gotCashCongrats.templateId,
        dynamicTemplateData: {
          paypalAccount,
          closedOut,
        },
      };
      await sendGrid.send(emailDetails);
    }),
  );

  if (!PaymentsWithPayPal.length) {
    await transaction.rollback();
    logger.info(`sendPayments: no pending payments`);
    return httpResponse.ok(response, {});
  }
  const senderBatchId = `Payouts_${moment().format('YYYY_MM_DD_SS')}`;

  const payoutsRequestData = {
    sender_batch_header: {
      sender_batch_id: senderBatchId,
      email_subject: 'You have a payout!',
      email_message: 'You have received a payout! Thanks for using our service!',
    },
    items: payoutsReceiversData,
  };
  logger.info(`sendPayments: payoutsRequestData ${JSON.stringify(payoutsRequestData)}`);

  const {
    batch_header: { payout_batch_id: payoutBatchId },
  } = await paymentsService.sendPayPalPayouts(payoutsRequestData);

  const updatePaymentsFilter = dto.generalDTO.filterData({
    status: constants.PENDING,
  });
  logger.info(`sendPayments: updatePaymentsFilter ${JSON.stringify(updatePaymentsFilter)}`);

  const updatePaymentsData = {
    status: constants.PROCESSING,
    payoutBatchId,
  };
  logger.info(`sendPayments: change pending payments status to PROCESSING :${JSON.stringify(updatePaymentsData)}`);
  await paymentsService.updatePayments(updatePaymentsFilter, updatePaymentsData, transaction);

  logger.info(`sendPayments: ended`);
  await transaction.commit();
  return httpResponse.ok(response, {});
};

/**
 * @description checkPayments is a controller used to check payments status
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const checkPayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`checkPayments: started`);
  const filter = dto.generalDTO.filterData({
    status: constants.PROCESSING,
    payoutBatchId: {
      [Op.not]: null,
    },
  });

  const processedPayments = await paymentsService.getAllPayments(filter, transaction);
  logger.info(`checkPayments: get all pending processedPayments ${JSON.stringify(processedPayments)}`);

  const payoutsBatchIds = processedPayments.reduce((acc: PayoutsBatchIdsAttributes, payment) => {
    const { payoutBatchId, closedOut, id } = payment;
    if (payoutBatchId && !acc[payoutBatchId])
      acc[payoutBatchId] = {
        closedOut,
        id,
      };
    return acc;
  }, {});
  logger.info(`checkPayments: get all payoutsBatchIds ${JSON.stringify(payoutsBatchIds)}`);
  const finishedPayouts: Array<string> = [];
  for await (const payoutBatchId of Object.keys(payoutsBatchIds)) {
    const {
      batch_header: { batch_status: batchStatus },
    } = await paymentsService.showPayoutBatchDetails(payoutBatchId);
    const status = batchStatus.toLowerCase();

    const updatePaymentsFilter = dto.generalDTO.filterData({
      payoutBatchId,
    });
    const updatePaymentsData = { status };
    await paymentsService.updatePayments(updatePaymentsFilter, updatePaymentsData, transaction);
    const updatePaymentsTransactionsFilter = dto.generalDTO.filterData({
      paymentId: payoutsBatchIds[payoutBatchId].id,
    });
    const data = {
      status,
    };
    logger.info(
      `checkPayments:  updatePaymentsTransactions ${JSON.stringify(
        updatePaymentsTransactionsFilter,
      )} data :${JSON.stringify(data)}`,
    );

    await paymentsTransitionsService.updatePaymentsTransactions(updatePaymentsTransactionsFilter, data, transaction);
    if (status === constants.SUCCESS) {
      finishedPayouts.push(payoutBatchId);
    }
  }

  const filteredProcessedPayments = processedPayments.filter((payment) =>
    finishedPayouts.includes(payment.payoutBatchId || ''),
  );
  await Promise.all(
    filteredProcessedPayments.map(async ({ payoutBatchId, userId, closedOut }) => {
      if (payoutBatchId) {
        const incrementUserFinicalData = {
          pending: -closedOut,
          earnings: closedOut,
          last_closed_out: closedOut,
        };
        const incrementUserFinicalDashboardFilter = dto.generalDTO.filterData({
          userId,
        });
        logger.info(
          `checkPayments:  increment user money for userId :${userId}  data :${JSON.stringify(
            incrementUserFinicalData,
          )}`,
        );

        await financialDashboardService.incrementUserFinicalDashboard(
          incrementUserFinicalData,
          incrementUserFinicalDashboardFilter,
          transaction,
        );
        const updateUserFinicalData = {
          last_closed_out: closedOut,
        };
        const updateUserFinicalDashboardFilter = dto.generalDTO.filterData({
          userId,
        });
        await financialDashboardService.updateUserFinicalDashboard(
          updateUserFinicalData,
          updateUserFinicalDashboardFilter,
          transaction,
        );
      }
      return payoutBatchId;
    }),
  );
  await transaction.commit();
  logger.info(`checkPayments:  ended`);
  return httpResponse.ok(response, {});
};

/**
 * @description getAllPayments is a controller used to get all payments
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const getAllPayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`getAllPayments:  started`);
  const payments = await paymentsService.getAllPayments(
    {
      where: {
        status: {
          [Op.not]: null,
        },
      },
    },
    transaction,
  );
  logger.info(`getAllPayments:  ended with  : ${JSON.stringify(payments)}`);
  await transaction.commit();
  return httpResponse.ok(response, payments);
};
