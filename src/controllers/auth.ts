import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { NextFunction, Request, Response } from 'express';
import database from '../database';
import { authHelpers, dto, httpResponse } from '../helpers';
import { messages } from '../helpers/constants';
import { CognitoUser } from '../interfaces';
import { usersServices } from '../services';
/**
 * @description signUp is a controller used to sign up new users
 * @param {Request} request request object
 * @param {Response} response response object
 * @param {NextFunction} _next middleware function
 * @return {Promise<Response>} object contains success status
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signUp = async (request: Request, response: Response, _next: NextFunction): Promise<Response> => {
  const transaction = await database.sequelize.transaction();
  let userSub;
  try {
    const body = dto.generalDTO.bodyData(request);

    const { password, ...userData } = dto.usersDTO.userData(body);
    let responseData = {};

    const emailExists = await usersServices.isEmailExists(userData.email, transaction);
    if (emailExists) {
      throw new Error(messages.auth.userAlreadyExists);
    }

    const data = await usersServices.createUser(userData, transaction);

    const attributes = dto.authDTO.cognitoAttributes({ ...userData, id: data.id });
    const attributeList = Object.keys(attributes).map(
      (key: string) =>
        new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: key,
          Value: (attributes as any)[key] ? (attributes as any)[key].toString() : '',
        }),
    );

    const cognitoUser: CognitoUser = await authHelpers.createCognitoUser(
      request.app,
      userData.email,
      password,
      attributeList,
    );

    ({ userSub } = cognitoUser);

    const filter = dto.generalDTO.filterData({ id: data.id });

    const [, [userUpdatedData]] = await usersServices.updateUser(filter, { cognitoId: userSub }, transaction);
    await transaction.commit();
    if (userUpdatedData) responseData = userUpdatedData;
    return httpResponse.created(response, responseData, messages.auth.userHasBeenCreated);
  } catch (error) {
    await transaction.rollback();
    if (userSub) {
      await authHelpers.removeCognitoUser(request.app, userSub);
    }
    return httpResponse.forbidden(response, error.message);
  }
};
