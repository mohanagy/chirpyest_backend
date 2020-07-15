/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { dto, httpResponse } from '../../helpers';
import { RakutenTransactionsAttributes } from '../../interfaces/Networks';
import { rakutenServices, usersServices } from '../../services';
import { calculateCommission } from '../../services/affiliateNetworks/utils';

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
    const userCommission = calculateCommission(rakutenTransactionData.commissions);
    await rakutenServices.updatePendingCash(userId, { pendingCash: userCommission }, transaction);
    await transaction.commit();
    return httpResponse.ok(res);
  }
  // The record is not linked to a current user
  // TODO: log this as it could be useful to investigate any broken urls
  rakutenTransactionData.userId = undefined;
  await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
  await transaction.commit();
  return httpResponse.ok(res);
};
