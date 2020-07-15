/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { dto } from '../helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getImpactRadiusWebhookData = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const queryData = dto.generalDTO.queryData(req);
  console.log('reqqq', req);
  console.log('body', req.body);
  console.log('query', queryData);

  /* seteps to do:
    1. Get the user_id form the body => u1 => user_id => ask about exposing the database serial ids danger?
    2. Check if the u1 is associated with a user
        - if u1 doesn't belong to one of our users mark this transaction to be zombie and log the error for later check

        2.1. if u1 belongs to a user (normal flow)
          1. save the entry to the rakuten transactions log
          2. Update the user financial dashboard:
            - Calculate the user share of the commission
            - Use increment query to increase the pending total by his share
            - if the affected rows for the previous query is 0 then run create query to add new row to the table with the share amount of data
*/
  // const impactRadiusTransactionData: any = dto.impactRadiusDTO.impactRadiusData(queryData);
  // const { userId } = rakutenTransactionData;

  await transaction.commit();
  res.send();
};
