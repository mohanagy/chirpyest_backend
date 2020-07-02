/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import database from '../database';
import { rakutenServices } from '../services';
import { RakutenTransactionsAttributes } from '../types/sequelize';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('req.body', req.body);
  console.log('req.headers', req.headers);
  // validate the data ??
  try {
    const {
      etransaction_id,
      advertiser_id,
      order_id,
      offer_id,
      sku_number,
      sale_amount,
      quantity,
      commissions,
      process_date,
      transaction_date,
      transaction_type,
      product_name,
      u1,
      currency,
      is_event,
    } = req.body;

    const data: RakutenTransactionsAttributes = {
      user_id: 1,
      transaction_id: etransaction_id,
      advertiser_id,
      order_id,
      offer_id,
      sku_number,
      sale_amount,
      quantity,
      commissions,
      process_date,
      transaction_date,
      transaction_type,
      product_name,
      u1,
      currency,
      is_event,
    };

    // start transaction
    const transaction = await database.sequelize.transaction();
    // dto stuff

    // save to db
    await rakutenServices.createRakutenTransaction(data, transaction);

    // update the pending money
  } catch (error) {
    console.log('error', error);
  }

  res.status(200).send('ok');
};
