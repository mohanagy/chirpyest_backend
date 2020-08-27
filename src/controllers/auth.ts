import { NextFunction, Request, Response } from 'express';
import { createFinancialRecord } from '../services/cashback';
import database from '../database';
import { authHelpers, dto, httpResponse } from '../helpers';
import { messages } from '../helpers/constants';
import { CognitoUser } from '../interfaces';
import { usersServices } from '../services';

/**
 * @description signUp is a controller used to sign up new users
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @return {Promise<Response>} object contains success status
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signUp = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
  const transaction = await database.sequelize.transaction();
  let userSub;
  try {
    const body = dto.generalDTO.bodyData(request);

    const { password, ...userData } = dto.usersDTO.userData(body);
    let responseData = {};

    const emailExists = await usersServices.isEmailExists(userData.email, transaction);
    if (emailExists) {
      await transaction.rollback();
      return httpResponse.conflict(response, messages.auth.userAlreadyExists);
    }

    const data = await usersServices.createUser(userData, transaction);

    const attributes = dto.authDTO.cognitoAttributes({ ...userData, id: data.id });
    const attributeList = authHelpers.generateCognitoAttributes(attributes);

    const cognitoUser: CognitoUser = await authHelpers.createCognitoUser(
      request.app,
      userData.email,
      password,
      attributeList,
    );

    ({ userSub } = cognitoUser);

    const filter = dto.generalDTO.filterData({ id: data.id });

    const [, [userUpdatedData]] = await usersServices.updateUser(filter, { cognitoId: userSub }, transaction);

    const financialRecord = {
      userId: data.id,
      pending: 0.0,
      receivableMilestone: 0.0,
      earnings: 0.0,
      lastClosedOut: 0.0,
    };
    await createFinancialRecord(financialRecord, transaction);

    await transaction.commit();
    if (userUpdatedData) responseData = userUpdatedData;
    return httpResponse.created(response, responseData, messages.auth.userHasBeenCreated);
  } catch (error) {
    await transaction.rollback();
    if (userSub) {
      await authHelpers.removeCognitoUser(request.app, userSub);
    }

    return httpResponse.internalServerError(next, error);
  }
};
