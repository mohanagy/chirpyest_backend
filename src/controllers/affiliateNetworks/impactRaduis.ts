/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import config from '../../config';
import { constants, dto, httpResponse, logger } from '../../helpers';
import { ImpactRadiusAttributes } from '../../interfaces';
import { cashBackService, impactRadiusServices, usersServices } from '../../services';

/**
 * @description getImpactRadiusWebhookData is a controller used receive Impact Radius webhook events
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @return {Promise<Response>} object contains success status
 */

export const getImpactRadiusWebhookData = async (
  request: Request,
  response: Response,
  next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const queryData = dto.generalDTO.queryData(request);
  logger.info(`getImpactRadiusWebhookData : started`);
  const impactRadiusTransactionData: ImpactRadiusAttributes = dto.impactRadiusDTO.impactRadiusData(queryData);
  logger.info(
    `getImpactRadiusWebhookData : impactRadiusTransactionData ${JSON.stringify(impactRadiusTransactionData)}`,
  );

  // Check if the url has the correct token
  if (impactRadiusTransactionData.token !== config.affiliateNetworks.impactRadiusConfig.webhookToken) {
    logger.info(`getImpactRadiusWebhookData : token doesn't match  `);
    return httpResponse.forbidden(response, constants.messages.general.forbidden);
  }

  const { userId } = impactRadiusTransactionData;

  let user;

  if (userId && Number.isInteger(+userId)) {
    const filter = dto.generalDTO.filterData({ id: userId });
    user = await usersServices.findUser(filter, transaction);
    logger.info(`getImpactRadiusWebhookData : get user data for userId ${userId}`);
  }

  if (userId && user) {
    logger.info(`getImpactRadiusWebhookData : user exist for the user id ${userId}  `);
    // TODO: Handle the case when the commission is zero or less than 2 cents
    await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);
    const transactionCommission = +impactRadiusTransactionData.payout;
    logger.info(`getImpactRadiusWebhookData : transactionCommission ${JSON.stringify(transactionCommission)} `);
    if (Number.isNaN(transactionCommission)) {
      logger.info(`getImpactRadiusWebhookData : transactionCommission `);
      await transaction.commit();
      return httpResponse.internalServerError(next, new Error(constants.messages.general.commissionTypeError));
    }
    const filter = dto.generalDTO.filterData({ userId });
    await cashBackService.updatePendingCash(userId, filter, transactionCommission, transaction);
    await transaction.commit();
    logger.info(`getImpactRadiusWebhookData : ended for user exist`);
    return httpResponse.ok(response);
  }

  // The record is not linked to a current user
  logger.info(`getImpactRadiusWebhookData : no user id found for this request  `);
  impactRadiusTransactionData.userId = undefined;
  await impactRadiusServices.createImpactRadiusTransaction(impactRadiusTransactionData, transaction);
  logger.info(`getImpactRadiusWebhookData : ended and no user exist`);
  await transaction.commit();
  return httpResponse.ok(response);
};
