import { NextFunction, Request, Response } from 'express';
import { createFinancialRecord } from '../services/cashback';
import database from '../database';
import { authHelpers, dto, httpResponse, logger } from '../helpers';
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
  logger.info(`signUp : started`);
  const transaction = await database.sequelize.transaction();
  let userSub;
  try {
    const body = dto.generalDTO.bodyData(request);
    logger.info(`signUp : body: ${JSON.stringify(body)}`);

    const { password, ...userData } = dto.usersDTO.userData(body);
    let responseData = {};

    const emailExists = await usersServices.isEmailExists(userData.email, transaction);
    logger.info(`signUp : emailExists: ${JSON.stringify(emailExists)}`);
    if (emailExists) {
      logger.info(`signUp : the user is exist: rollback`);
      await transaction.rollback();
      return httpResponse.conflict(response, messages.auth.userAlreadyExists);
    }

    const createdUserData = await usersServices.createUser(userData, transaction);
    logger.info(`signUp : createdUserData: ${JSON.stringify(createdUserData)}`);

    const cognitoAttributes = dto.authDTO.cognitoAttributes({ ...userData, id: createdUserData.id });
    const cognitoAttributesList = authHelpers.generateCognitoAttributes(cognitoAttributes);
    logger.info(`signUp : cognitoAttributes: ${JSON.stringify(cognitoAttributes)}`);
    logger.info(`signUp : cognitoAttributesList: ${JSON.stringify(cognitoAttributesList)}`);

    const cognitoUser: CognitoUser = await authHelpers.createCognitoUser(
      request.app,
      userData.email,
      password,
      cognitoAttributesList,
    );
    logger.info(`signUp : cognitoUser: ${cognitoUser}`);

    ({ userSub } = cognitoUser);

    const filter = dto.generalDTO.filterData({ id: createdUserData.id });

    logger.info(`signUp : updateUser With userSub: ${userSub}`);
    const [, [userUpdatedData]] = await usersServices.updateUser(filter, { cognitoId: userSub }, transaction);
    logger.info(`signUp : userUpdated: ${JSON.stringify(userUpdatedData)}`);

    const financialRecord = {
      userId: createdUserData.id,
      pending: 0.0,
      receivableMilestone: 0.0,
      earnings: 0.0,
      lastClosedOut: 0.0,
    };
    logger.info(`signUp : create financial Record for the user: ${JSON.stringify(financialRecord)}`);
    await createFinancialRecord(financialRecord, transaction);

    await transaction.commit();
    if (userUpdatedData) responseData = userUpdatedData;
    logger.info(`signUp : ended with response : ${JSON.stringify(responseData)} `);
    return httpResponse.created(response, responseData, messages.auth.userHasBeenCreated);
  } catch (error) {
    logger.info(`signUp : error happens : ${JSON.stringify(error)} `);
    await transaction.rollback();
    if (userSub) {
      logger.info(`signUp : remove user from cognito when error happens `);
      await authHelpers.removeCognitoUser(request.app, userSub);
    }
    logger.info(`signUp : ended with internal Server Error `);
    return httpResponse.internalServerError(next, error);
  }
};
