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
  console.log('body', req.body);
  console.log('query', queryData);
  await transaction.commit();
  res.send();
};
