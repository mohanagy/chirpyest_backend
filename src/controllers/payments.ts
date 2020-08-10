import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Transaction } from 'sequelize/types';
import { v4 as uuid } from 'uuid';
import { constants, dto, httpResponse, logger } from '../helpers';
import { PaymentsAttributes } from '../interfaces';
import { paymentsService, usersServices } from '../services';

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
  logger.info(`receive Cron Job : ${moment().format('YYYY-MM-DD HH:ss')}`);

  // const apiRequest = axios.create({
  //   baseURL: `${request.protocol}://127.0.0.1:${port}`,
  // });

  logger.info(`call affiliate networks services: ${moment().format('YYYY-MM-DD HH:ss')}`);
  const affiliateNetworksRequest = [
    Promise.resolve({
      data: [{ userId: 1, type: 'CJ', total: 10 }],
    }),
    Promise.resolve({
      data: [{ userId: 1, type: 'R', total: 20 }],
    }),
    Promise.resolve({
      data: [{ userId: 3, type: 'IR', total: 5 }],
    }),
  ];

  logger.info(`resolve affiliate networks services response: ${moment().format('YYYY-MM-DD HH:ss')}`);
  const affiliateNetworksResult = await Promise.allSettled(affiliateNetworksRequest);

  logger.info(`get fulfilled affiliate networks services response : ${moment().format('YYYY-MM-DD HH:ss')}`);
  const fulfilledRequests: Array<PromiseFulfilledResult<Record<string, any>>> = affiliateNetworksResult.filter(
    (result) => result.status === 'fulfilled',
  ) as Array<PromiseFulfilledResult<Record<string, any>>>;

  logger.info(
    `convert  affiliate networks services response to object of users: ${moment().format('YYYY-MM-DD HH:ss')}`,
  );
  const classifiedResponseByUserId = fulfilledRequests
    .flatMap(({ value }) => value.data)
    .reduce((acc: any, element) => {
      if (!acc[element.userId]) {
        acc[element.userId] = {
          [element.type]: element,
          closedOut: element.total,
        };
      } else {
        acc[element.userId][element.type] = element;
        acc[element.userId].closedOut += element.total;
      }

      return acc;
    }, {});

  logger.info(`fetch all users from database to match response: ${moment().format('YYYY-MM-DD HH:ss')}`);
  const users = await usersServices.findAllUsers();
  const usersObject = users.reduce((acc: any, user) => {
    if (user.id && !acc[user.id]) acc[user.id] = user;
    return acc;
  }, {});

  logger.info(
    `manipulate affiliate networks services response to fit payments service: ${moment().format('YYYY-MM-DD HH:ss')}`,
  );
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

  const filter = dto.generalDTO.filterData({ status: constants.PENDING });

  const pendingPayments = await paymentsService.getAllPayments(filter, transaction);

  const paymentsPayload = paymentsDraftPayload.filter((row) => {
    const lastPayment = pendingPayments.reverse().find((element) => element.userId === row.userId);
    if (!lastPayment) return true;
    const { updatedAt } = lastPayment;
    const isBeforeMonth = moment(updatedAt).isBefore(1, 'm');
    return isBeforeMonth;
  });

  logger.info(`payments payload ${paymentsPayload}: ${moment().format('YYYY-MM-DD HH:ss')}`);
  logger.info(`creat new payment records : ${moment().format('YYYY-MM-DD HH:ss')}`);
  await paymentsService.createBulkPayments(paymentsPayload, transaction);
  logger.info(`process done : ${moment().format('YYYY-MM-DD HH:ss')}`);

  await transaction.commit();
  return httpResponse.ok(response, {});
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

  logger.info(`sendPayments: get all pending  payments: ${moment().format('YYYY-MM-DD HH:ss')}`);
  const pendingPayments = await paymentsService.getAllPayments(filter, transaction);
  logger.info(`sendPayments: pending payments ${pendingPayments}: ${moment().format('YYYY-MM-DD HH:ss')}`);

  logger.info(`sendPayments: convert data to paypal shape : ${moment().format('YYYY-MM-DD HH:ss')}`);
  const payoutsReceiversData = pendingPayments.map(({ paypalAccount, closedOut, transactionId }) => ({
    recipient_type: 'EMAIL',
    amount: {
      value: closedOut,
      currency: 'USD',
    },
    receiver: paypalAccount,
    sender_item_id: transactionId || uuid(),
  }));
  const senderBatchId = `Payouts_${moment().format('YYYY_MM_DD_SS')}`;

  const payoutsRequestData = {
    sender_batch_header: {
      sender_batch_id: senderBatchId,
      email_subject: 'You have a payout!',
      email_message: 'You have received a payout! Thanks for using our service!',
    },
    items: payoutsReceiversData,
  };
  logger.info(`sendPayments: payoutsRequestData ${payoutsRequestData}: ${moment().format('YYYY-MM-DD HH:ss')}`);

  await paymentsService.sendPayPalPayouts(payoutsRequestData);

  const updatePaymentsFilter = dto.generalDTO.filterData({
    status: constants.PENDING,
  });
  const updatePaymentsData = {
    status: constants.PROCESSING,
  };
  logger.info(`sendPayments: change pending payments status to PROCESSING : ${moment().format('YYYY-MM-DD HH:ss')}`);
  await paymentsService.updatePayments(updatePaymentsFilter, updatePaymentsData, transaction);

  logger.info(`sendPayments: done : ${moment().format('YYYY-MM-DD HH:ss')}`);
  return httpResponse.ok(response, {});
};
