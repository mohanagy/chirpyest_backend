/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import config from '../../config';
import { constants, dto, httpResponse } from '../../helpers';
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
  const headers = dto.generalDTO.headerData(request);
  const secretCommissionJunctionKey = dto.commissionJunctionDTO.commissionJunctionWebhookSecret(headers);

  if (!secretCommissionJunctionKey || commissionJunctionConfig.cJPersonalKey !== secretCommissionJunctionKey) {
    await transaction.rollback();
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }
  const bodyData = dto.generalDTO.bodyData(request);

  if (!Array.isArray(bodyData)) {
    await transaction.rollback();
    return httpResponse.conflict(response, constants.messages.general.internalServerError);
  }
  const commissionJunctionData: CommissionJunctionData = dto.commissionJunctionDTO.commissionJunctionData(bodyData);

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
  const commissionJunctionDataForUsers = await affiliateNetworksServices.commissionJunctionServices.createBulkCommissionJunctionTransactions(
    modifiedCommissionJunctionData,
    transaction,
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

  await Promise.all(
    Object.keys(dataForUpdatingPendingCash).map(async (userId) => {
      const filter = dto.generalDTO.filterData({ userId });
      await cashBackService.updatePendingCash(Number(userId), filter, dataForUpdatingPendingCash[userId], transaction);
    }),
  );

  await transaction.commit();
  return httpResponse.ok(response);
};
