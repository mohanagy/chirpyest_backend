import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize/types';
import { v4 as uuid } from 'uuid';
import { constants, dto, httpResponse, logger, mailer } from '../helpers';
import { ClassifiedResponseByUserIdAttributes, PaymentsAttributes, PayoutsBatchIdsAttributes } from '../interfaces';
import { financialDashboardService, paymentsService, paymentsTransitionsService, usersServices } from '../services';

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
  logger.info(`receive Cron Job`);

  const paymentsTransitionsFilter = dto.generalDTO.filterData({ status: constants.PENDING });

  const paymentsTransactions = await paymentsTransitionsService.getAllPaymentsTransactions(
    paymentsTransitionsFilter,
    transaction,
  );

  const pendingTransactions = paymentsTransactions.filter((result) => result.status === constants.PENDING);

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

  logger.info(`fetch all users from database to match response`);
  const users = await usersServices.findAllUsers();
  const usersObject = users.reduce((acc: any, user) => {
    if (user.id && !acc[user.id]) acc[user.id] = user;
    return acc;
  }, {});

  logger.info(`manipulate affiliate networks services response to fit payments service`);
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

  logger.info(`creat new payment records`);
  const paymentsData = await paymentsService.createBulkPayments(paymentsDraftPayload, transaction);

  await Promise.all(
    paymentsData.map(async ({ id, userId }) => {
      const filter = dto.generalDTO.filterData({
        userId,
        status: constants.PENDING,
      });

      const data = {
        paymentId: id,
        status: constants.PREPARING,
      };

      await paymentsTransitionsService.updatePaymentsTransactions(filter, data, transaction);
    }),
  );

  logger.info(`process done`);

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
  const pendingPayments = await paymentsService.getAllPayments(filter, transaction);
  logger.info(`sendPayments: pending payments ${pendingPayments}`);

  logger.info(`sendPayments: convert data to paypal shape`);
  const payoutsReceiversData = pendingPayments.map(({ paypalAccount, closedOut, transactionId }) => ({
    recipient_type: 'EMAIL',
    amount: {
      value: closedOut,
      currency: 'USD',
    },
    receiver: paypalAccount,
    sender_item_id: transactionId || uuid(),
  }));
  if (!pendingPayments.length) {
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
  logger.info(`sendPayments: payoutsRequestData ${payoutsRequestData}`);

  const {
    batch_header: { payout_batch_id: payoutBatchId },
  } = await paymentsService.sendPayPalPayouts(payoutsRequestData);

  const updatePaymentsFilter = dto.generalDTO.filterData({
    status: constants.PENDING,
  });

  const updatePaymentsData = {
    status: constants.PROCESSING,
    payoutBatchId,
  };
  logger.info(`sendPayments: change pending payments status to PROCESSING`);
  await paymentsService.updatePayments(updatePaymentsFilter, updatePaymentsData, transaction);

  logger.info(`sendPayments: done`);
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
  const filter = dto.generalDTO.filterData({
    status: constants.PROCESSING,
    payoutBatchId: {
      [Op.not]: null,
    },
  });

  logger.info(`sendPayments: get all pending payments`);
  const processedPayments = await paymentsService.getAllPayments(filter, transaction);

  const payoutsBatchIds = processedPayments.reduce((acc: PayoutsBatchIdsAttributes, payment) => {
    const { payoutBatchId, closedOut } = payment;
    if (payoutBatchId && !acc[payoutBatchId])
      acc[payoutBatchId] = {
        closedOut,
      };
    return acc;
  }, {});
  const finishedPayouts = await Promise.all(
    Object.keys(payoutsBatchIds).filter(async (payoutBatchId) => {
      const {
        batch_header: { batch_status: batchStatus },
      } = await paymentsService.showPayoutBatchDetails(payoutBatchId);
      const status = batchStatus.toLowerCase();

      const updatePaymentsFilter = dto.generalDTO.filterData({
        payoutBatchId,
      });
      const updatePaymentsData = { status };
      await paymentsService.updatePayments(updatePaymentsFilter, updatePaymentsData);
      if (status === constants.SUCCESS) {
        return payoutBatchId;
      }

      await mailer.transporter.sendMail({
        from: '"Mohammed Naji" <naji@kiitos-tech.com>', // sender address
        to: 'naji@kiitos-tech.com', // list of receivers
        subject: 'Payment Error',
        text: `this payout Batch Id ${payoutBatchId} has status :${status}`, // plain text body
      });

      return false;
    }),
  );
  const filteredProcessedPayments = processedPayments.filter((payment) =>
    Object.keys(finishedPayouts).includes(payment.payoutBatchId || ''),
  );

  await Promise.all(
    filteredProcessedPayments.map(({ payoutBatchId, userId, closedOut }) => {
      if (payoutBatchId) {
        const updateUserFinicalData = {
          pending: -closedOut,
          earnings: closedOut,
          last_closed_out: closedOut,
        };
        const updateUserFinicalDashboardFilter = dto.generalDTO.filterData({
          userId,
        });
        financialDashboardService.updateUserFinicalDashboard(
          updateUserFinicalData,
          updateUserFinicalDashboardFilter,
          transaction,
        );
      }
      return payoutBatchId;
    }),
  );
  await transaction.commit();
  return httpResponse.ok(response, {});
};
