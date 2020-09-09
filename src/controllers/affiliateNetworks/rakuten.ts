/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { constants, dto, httpResponse, logger } from '../../helpers';
import { RakutenTransactionsAttributes } from '../../interfaces/Networks';
import { cashBackService, rakutenServices, usersServices } from '../../services';

/**
 * @description getRakutenWebhookData is a controller used receive Rakuten webhook events data and save it and update the user financial dashboard
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @return {Promise<Response>} object contains success status
 */

export const getRakutenWebhookData = async (
  request: Request,
  response: Response,
  next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  logger.info(`getRakutenWebhookData : started`);
  const queryData = dto.generalDTO.queryData(request);
  logger.info(`getRakutenWebhookData : queryData ${JSON.stringify(queryData)}`);
  const rakutenTransactionData: RakutenTransactionsAttributes = dto.rakutenDTO.rakutenData(queryData);
  const { userId } = rakutenTransactionData;
  logger.info(`getRakutenWebhookData : rakutenTransactionData ${JSON.stringify(rakutenTransactionData)}`);
  let user;

  if (userId && Number.isInteger(+userId)) {
    logger.info(`getRakutenWebhookData : userId ${userId}`);
    const filter = dto.generalDTO.filterData({ id: userId });
    user = await usersServices.findUser(filter, transaction);
    logger.info(`getRakutenWebhookData : user ${user}`);
  }

  if (userId && user) {
    logger.info(`getRakutenWebhookData : user found `);
    try {
      await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        logger.info(`getRakutenWebhookData : duplicated transaction event`);
        await transaction.rollback();
        return httpResponse.ok(response);
      }
      throw err;
    }
    logger.info(`getRakutenWebhookData : create rakuten transaction for the user `);

    const transactionCommission = Number(rakutenTransactionData.commissions);
    if (Number.isNaN(transactionCommission)) {
      logger.info(`getRakutenWebhookData : transaction commission is not a number `);
      await transaction.rollback();
      return httpResponse.internalServerError(next, new Error(constants.messages.general.commissionTypeError));
    }

    const filter = dto.generalDTO.filterData({ userId });
    logger.info(
      `getRakutenWebhookData : update the pending cash for the user ${JSON.stringify(transactionCommission)} `,
    );
    await cashBackService.updatePendingCash(userId, filter, transactionCommission, transaction);
    await transaction.commit();
    logger.info(`getRakutenWebhookData : ended with user`);
    return httpResponse.ok(response);
  }
  // The record is not linked to a current user
  logger.info(`getRakutenWebhookData : creat transaction but without user `);
  rakutenTransactionData.userId = undefined;
  await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
  await transaction.commit();
  logger.info(`getRakutenWebhookData : ended without user`);
  return httpResponse.ok(response);
};
