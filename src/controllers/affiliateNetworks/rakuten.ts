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
  const queryData = dto.generalDTO.queryData(request);
  const rakutenTransactionData: RakutenTransactionsAttributes = dto.rakutenDTO.rakutenData(queryData);
  const { userId } = rakutenTransactionData;

  let user;

  if (userId && Number.isInteger(+userId)) {
    const filter = dto.generalDTO.filterData({ id: userId });
    user = await usersServices.findUser(filter, transaction);
  }

  if (userId && user) {
    await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);

    const transactionCommission = Number(rakutenTransactionData.commissions);
    if (Number.isNaN(transactionCommission)) {
      return httpResponse.internalServerError(next, new Error(constants.messages.general.commissionTypeError));
    }
    await cashBackService.updatePendingCash(userId, transactionCommission, transaction);
    await transaction.commit();
    return httpResponse.ok(response);
  }
  // The record is not linked to a current user
  logger.log('warn', 'Rakuten: Url has no userId', request.query);
  rakutenTransactionData.userId = undefined;
  await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
  await transaction.commit();
  return httpResponse.ok(response);
};
