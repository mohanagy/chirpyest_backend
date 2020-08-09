import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Transaction } from 'sequelize/types';
import { constants, httpResponse, logger } from '../helpers';
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
  const filteredData: Array<PaymentsAttributes> = Object.keys(classifiedResponseByUserId)
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
      };
    });
  logger.info(`payments payload ${filteredData}: ${moment().format('YYYY-MM-DD HH:ss')}`);
  logger.info(`creat new payment records : ${moment().format('YYYY-MM-DD HH:ss')}`);
  await paymentsService.createBulkPayments(filteredData, transaction);
  logger.info(`process done : ${moment().format('YYYY-MM-DD HH:ss')}`);

  await transaction.commit();
  return httpResponse.ok(response, {}, constants.messages.users.userProfile);
};
