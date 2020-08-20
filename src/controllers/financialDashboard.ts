import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { calculateUserPendingCash, constants, dto, httpResponse } from '../helpers';
import { financialDashboardService } from '../services';

/**
 * @description getUserFinancialData is a controller used to fetch user financial summary
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction transaction
 * @return {Promise<Response>} object contains success status
 */

export const getUserFinancialData = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const user = request.app.get('user');
  const userId = dto.usersDTO.userId(request);
  if (!user || Number(user.id) !== Number(userId.id)) {
    await transaction.rollback();
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }
  const filter = dto.generalDTO.filterData({ userId: userId.id });
  const data = await financialDashboardService.getUserFinancialDashboard(filter, transaction);
  if (data) {
    const pendingDollars = calculateUserPendingCash(data.pending);
    data.pending = pendingDollars;
  }
  await transaction.commit();
  return response.send(data);
};
