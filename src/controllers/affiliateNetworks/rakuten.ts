/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { dto, httpResponse, logger } from '../../helpers';
import { RakutenTransactionsAttributes } from '../../interfaces/Networks';
import { cashBackService, rakutenServices, usersServices } from '../../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const queryData = dto.generalDTO.queryData(req);
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
      return httpResponse.internalServerError(_next, new Error('Transaction commission must be a number'));
    }
    await cashBackService.updatePendingCash(userId, { pendingCash: transactionCommission }, transaction);
    await transaction.commit();
    return httpResponse.ok(res);
  }
  // The record is not linked to a current user
  logger.log('warn', 'Rakuten: Url has no userId', req.query);
  rakutenTransactionData.userId = undefined;
  await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
  await transaction.commit();
  return httpResponse.ok(res);
};
