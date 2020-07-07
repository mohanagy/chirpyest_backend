/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import database from '../database';
import { dto, httpResponse } from '../helpers';
import { messages } from '../helpers/constants';
import { RakutenTransactionsAttributes } from '../interfaces/Networks';
import { rakutenServices, usersServices } from '../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const transaction = await database.sequelize.transaction();
  try {
    const rakutenTransactionData: RakutenTransactionsAttributes = dto.rakutenDTO.rakutenData(req.query);
    const { userId } = rakutenTransactionData;

    let user;

    if (userId && Number.isInteger(+userId)) {
      user = await usersServices.findUser({ where: { id: userId } }, transaction);
    }

    if (userId && user) {
      await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
      await rakutenServices.updatePendingCash(
        userId,
        { commissions: rakutenTransactionData.commissions, saleAmount: rakutenTransactionData.saleAmount },
        transaction,
      );
      await transaction.commit();
      return httpResponse.ok(res);
    }

    // The record is not linked to a current user
    // TODO: log this as it could be useful to investigate any broken urls
    rakutenTransactionData.userId = undefined;
    await rakutenServices.createRakutenTransaction(rakutenTransactionData, transaction);
    await transaction.commit();
    return httpResponse.ok(res);
  } catch (error) {
    await transaction.rollback();
    httpResponse.internalServerError(next, new Error(messages.general.internalServerError));
  }
};
