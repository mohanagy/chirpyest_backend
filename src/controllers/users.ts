import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { constants, dto, httpResponse } from '../helpers';
import { usersServices } from '../services';

/**
 * @description getUserProfile is a controller used to fetch user profile data
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const getUserProfile = async (
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
  await transaction.commit();
  return httpResponse.ok(response, dto.usersDTO.userProfileResponse(user), constants.messages.users.userProfile);
};
/**
 * @description updateUserProfile is a controller used to update user profile data
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 * @returns Promise
 */
export const updateUserProfile = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const user = request.app.get('user');
  const userId = dto.usersDTO.userId(request);
  const bodyData = dto.generalDTO.bodyData(request);
  const userData = dto.usersDTO.userProfileUpdatableFields(bodyData);

  if (!user || Number(user.id) !== Number(userId.id)) {
    await transaction.rollback();
    return httpResponse.unAuthorized(response, constants.messages.auth.notAuthorized);
  }

  const filter = dto.generalDTO.filterData(userId);

  const [, [updateUserDataResult]] = await usersServices.updateUser(filter, userData, transaction);

  await transaction.commit();
  return httpResponse.ok(
    response,
    dto.usersDTO.userProfileResponse(updateUserDataResult),
    constants.messages.users.updateUserProfileSuccess,
  );
};

/**
 * @description getUsersList is a controller used to get all users
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} array of users
 * @returns Promise
 */
export const getUsersList = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const users = await usersServices.findAllUsers(transaction);

  await transaction.commit();
  return httpResponse.ok(response, users);
};
