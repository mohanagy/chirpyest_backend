import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { constants, dto, httpResponse } from '../helpers';

/**
 * @description getUserFinancialData is a controller used to fetch user financial summary
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @return {Promise<Response>} object contains success status
 */

export const getUserFinancialData = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  // get user id from the endpoint and the authenticated user
  // if the user is authorized then fetch the data
  // send the data
  const user = request.app.get('user');
  console.log('user', user);
  const userId = dto.usersDTO.userId(request);
  console.log('userId', userId);
  if (!user || Number(user.id) !== Number(userId.id)) {
    await transaction.rollback();
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }
  await transaction.commit();
  return httpResponse.ok(response, dto.usersDTO.userProfileResponse(user), constants.messages.users.userProfile);
};
