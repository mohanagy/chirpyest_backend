import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Application } from 'express';
import config from '../config';
import { CognitoUser } from '../interfaces';

/**
 * @description createCognitoUser is a function  used to create an account in User Pool
 * @param {Application} app represent express
 * @param {string} email user email
 * @param {string} password user password
 * @param {Array<AmazonCognitoIdentity.CognitoUserAttribute>} attributeList represent cognito pool attributes
 * @returns {Promise<CognitoUser>}
 */
export const createCognitoUser = (
  app: Application,
  email: string,
  password: string,
  attributeList: Array<AmazonCognitoIdentity.CognitoUserAttribute>,
): Promise<CognitoUser> => {
  const cognitoPool = app.get('cognito');
  return new Promise((resolve, reject) => {
    cognitoPool.signUp(email, password, attributeList, null, (err: Error, result: CognitoUser) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

/**
 * @description removeCognitoUser is used to delete the user in case the transaction fails while creating the user
 * @param {Application} app represent express
 * @param {string} cognitoId  represent user id
 * @return {Promise<any>}
 */
export const removeCognitoUser = (app: Application, cognitoId: string): Promise<any> => {
  const cognitoProvider = app.get('cognitoProvider');
  const {
    cognito: {
      cognitoPoolConfig: { UserPoolId },
    },
  } = config;
  const params = { UserPoolId, Username: cognitoId };

  return new Promise((resolve, reject) => {
    cognitoProvider.adminDeleteUser(params, (err: Error, data: any) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};
