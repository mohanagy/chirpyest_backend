/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import database from '../database';
import { convertToCents, httpResponse, keysToCamel } from '../helpers';
import { rakutenServices, usersServices } from '../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const transaction = await database.sequelize.transaction();
  try {
    const camelizedResponse = keysToCamel(req.query);

    const {
      etransactionId,
      orderId,
      offerId,
      skuNumber,
      quantity,
      saleAmount,
      commissions,
      processDate,
      transactionDate,
      transactionType,
      productName,
      u1,
      currency,
      isEvent,
    } = camelizedResponse;
    const userId = u1;

    const cleanRakutenTransactionData: any = {
      userId,
      etransactionId,
      orderId,
      offerId,
      skuNumber,
      quantity,
      saleAmount: convertToCents(saleAmount),
      commissions: convertToCents(commissions),
      processDate,
      transactionDate,
      transactionType,
      productName,
      u1,
      currency,
      isEvent,
    };

    // check if u1 doesn't match any users log the err
    if (!userId || !Number.isInteger(+userId)) {
      // TODO: log this as it could be useful to investigate any broken urls
      cleanRakutenTransactionData.userId = null;
      await rakutenServices.createRakutenTransaction(cleanRakutenTransactionData, transaction);
      await transaction.commit();
      return res.status(200).json({ success: true });
    }

    const user = await usersServices.findUser({ where: { id: userId } }, transaction);

    if (!user) {
      // TODO: log this as it could be useful to investigate any broken urls
      cleanRakutenTransactionData.userId = null;
      await rakutenServices.createRakutenTransaction(cleanRakutenTransactionData, transaction);
      await transaction.commit();
      return res.status(200).json({ success: true });
    }

    // save to db
    await rakutenServices.createRakutenTransaction(cleanRakutenTransactionData, transaction);
    await rakutenServices.updatePendingCash(
      userId,
      { commissions: cleanRakutenTransactionData.commissions, saleAmount: cleanRakutenTransactionData.saleAmount },
      transaction,
    );
    await transaction.commit();
    return res.status(200).json({ success: true });
  } catch (error) {
    await transaction.rollback();
    return httpResponse.internalServerError(next, error.message);
  }
};
