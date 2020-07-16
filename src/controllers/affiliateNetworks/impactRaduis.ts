/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import config from '../../config';
import { calculateCommission, dto, httpResponse, logger } from '../../helpers';
import { ImpactRadiusAttributes } from '../../interfaces';
import { cashBackService, impactRadiusServices, usersServices } from '../../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getImpactRadiusWebhookData = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const queryData = dto.generalDTO.queryData(req);
  const impactRadiusTransactionData: ImpactRadiusAttributes = dto.impactRadiusDTO.impactRadiusData(queryData);
  // Check if the url has the correct token
  if (impactRadiusTransactionData.token !== config.affiliateNetworks.impactRadiusToken) {
    return httpResponse.forbidden(res, 'Forbidden');
  }

  const { userId } = impactRadiusTransactionData;

  let user;

  if (userId && Number.isInteger(+userId)) {
    const filter = dto.generalDTO.filterData({ id: userId });
    user = await usersServices.findUser(filter, transaction);
  }

  if (userId && user) {
    // TODO: Handle the case when the commission is zero or less than 2 cents
    await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);
    const userCommission = calculateCommission(+impactRadiusTransactionData.amount);
    await cashBackService.updatePendingCash(userId, { pendingCash: userCommission }, transaction);
    await transaction.commit();
    return httpResponse.ok(res);
  }

  // The record is not linked to a current user
  logger.log('warn', 'IR: Url has no userId', req.query);
  impactRadiusTransactionData.userId = undefined;
  await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);
  await transaction.commit();
  return httpResponse.ok(res);
};
