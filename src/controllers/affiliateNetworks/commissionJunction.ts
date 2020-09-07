/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import config from '../../config';
import { constants, dto, httpResponse, logger } from '../../helpers';
import { CommissionJunctionData } from '../../interfaces';
import { affiliateNetworksServices, cashBackService, usersServices } from '../../services';

const {
  affiliateNetworks: { commissionJunctionConfig },
} = config;

/**
 * @description getCommissionJunction is a webhook used to handle commissionJunction data
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */
export const getCommissionJunction = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  logger.info(`getCommissionJunction : started`);
  const headers = dto.generalDTO.headerData(request);
  const secretCommissionJunctionKey = dto.commissionJunctionDTO.commissionJunctionWebhookSecret(headers);
  logger.info(`getCommissionJunction : secretCommissionJunctionKey : ${JSON.stringify(secretCommissionJunctionKey)}`);

  if (!secretCommissionJunctionKey || commissionJunctionConfig.cJPersonalKey !== secretCommissionJunctionKey) {
    logger.info(`getCommissionJunction : secret key not exist or not match `);
    await transaction.rollback();
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }
  const bodyData = dto.generalDTO.bodyData(request);
  logger.info(`getCommissionJunction : bodyData: ${JSON.stringify(bodyData)}`);

  if (!Array.isArray(bodyData)) {
    logger.info(`getCommissionJunction : the data  is not an array `);
    await transaction.rollback();
    return httpResponse.conflict(response, constants.messages.general.internalServerError);
  }
  const commissionJunctionData: CommissionJunctionData = dto.commissionJunctionDTO.commissionJunctionData(bodyData);
  logger.info(`getCommissionJunction : commissionJunctionData ${JSON.stringify(commissionJunctionData)}`);

  const users = await usersServices.findAllUsers(transaction);

  const modifiedCommissionJunctionData = commissionJunctionData.map((row) => {
    const modifiedRow = { ...row };
    if (row.userId && Number.isInteger(+row.userId)) {
      const userData = users.find((user) => user.id === row.userId);
      if (!userData) {
        modifiedRow.userId = undefined;
      }
    }
    return modifiedRow;
  });
  logger.info(
    `getCommissionJunction : modifiedCommissionJunctionData ${JSON.stringify(modifiedCommissionJunctionData)}`,
  );

  const commissionJunctionDataForUsers = await affiliateNetworksServices.commissionJunctionServices.createBulkCommissionJunctionTransactions(
    modifiedCommissionJunctionData,
    transaction,
  );

  logger.info(
    `getCommissionJunction : commissionJunctionDataForUsers ${JSON.stringify(commissionJunctionDataForUsers)}`,
  );

  const dataForUpdatingPendingCash = commissionJunctionDataForUsers.reduce((acc: any, row) => {
    if (row.userId) {
      if (!acc[row.userId]) {
        acc[row.userId] = row.pubCommissionAmountUsd;
      } else {
        acc[row.userId] += row.pubCommissionAmountUsd;
      }
    }
    return acc;
  }, {});
  logger.info(`getCommissionJunction : dataForUpdatingPendingCash ${JSON.stringify(dataForUpdatingPendingCash)}`);

  await Promise.all(
    Object.keys(dataForUpdatingPendingCash).map((userId) => {
      const filter = dto.generalDTO.filterData({ userId });
      return cashBackService.updatePendingCash(Number(userId), filter, dataForUpdatingPendingCash[userId], transaction);
    }),
  );

  logger.info(`getCommissionJunction : ended`);
  await transaction.commit();
  return httpResponse.ok(response);
};
