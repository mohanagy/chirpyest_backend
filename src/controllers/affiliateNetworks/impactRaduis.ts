/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import config from '../../config';
import { dto, httpResponse } from '../../helpers';
import { impactRadiusServices, rakutenServices, usersServices } from '../../services';
import { calculateCommission } from '../../services/affiliateNetworks/utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getImpactRadiusWebhookData = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const queryData = dto.generalDTO.queryData(req);
  console.log('query', queryData);

  const impactRadiusTransactionData: any = dto.impactRadiusDTO.impactRadiusData(queryData);
  // Check if the url has the correct token
  if (impactRadiusTransactionData.token !== config.affiliateNetworks.impactRadiusToken) {
    return httpResponse.forbidden(res, 'The request should have a valid token');
  }

  const { userId } = impactRadiusTransactionData;

  let user;

  if (userId && Number.isInteger(+userId)) {
    const filter = dto.generalDTO.filterData({ id: userId });
    user = await usersServices.findUser(filter, transaction);
  }

  if (userId && user) {
    await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);

    const userCommission = calculateCommission(+impactRadiusTransactionData.amount);

    await rakutenServices.updatePendingCash(userId, { pendingCash: userCommission }, transaction);

    await transaction.commit();
    return httpResponse.ok(res);
  }

  // The record is not linked to a current user
  // TODO: log this as it could be useful to investigate any broken urls
  impactRadiusTransactionData.userId = undefined;
  await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);
  await transaction.commit();
  return httpResponse.ok(res);
};
