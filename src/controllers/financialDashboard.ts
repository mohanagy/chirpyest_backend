import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { calculateUserPendingCash, constants, dto, httpResponse } from '../helpers';
import { financialDashboardService } from '../services';

/**
 * @description getUserFinancialData is a controller used to fetch user financial summary
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} _transaction transaction
 * @return {Promise<Response>} object contains success status
 */

export const getUserFinancialData = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  _transaction: Transaction,
): Promise<Response> => {
  const user = request.app.get('user');
  const userId = dto.usersDTO.userId(request);
  if (!user || Number(user.id) !== Number(userId.id)) {
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }
  const filter = dto.generalDTO.filterData({ userId: userId.id });
  const data = await financialDashboardService.getUserFinancialDahsboard(filter);
  const pendingDollars = calculateUserPendingCash(data.pending);
  data.pending = pendingDollars;
  return response.send(data);
};
