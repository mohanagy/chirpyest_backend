import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Application } from 'express';
import { verify, VerifyErrors } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import config from '../config';
import { CognitoAttributes, CognitoUser } from '../interfaces';

const {
  cognito: { jwt },
} = config;
const pem = jwkToPem(jwt);

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
export const removeCognitoUser = (app: Application, cognitoId?: string): Promise<any> => {
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
/**
 * @description verifyJWTToken is a function used to verify the Auth token if
 * it has the  same signature or is not expired
 * @param  {string} token
 * @returns Promise
 */
export const verifyJWTToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    verify(token, pem, { algorithms: ['RS256'] }, (err: VerifyErrors | null, decodedToken) => {
      if (err || !decodedToken) return reject(err);
      return resolve(decodedToken);
    });
  });
/**
 * @description generateCognitoAttributes is a function used to generate
 * cognito attributes
 * @param  {CognitoAttributes} attributes
 * @returns {Array<CognitoUserAttribute>}
 */
export const generateCognitoAttributes = (
  attributes: CognitoAttributes,
): AmazonCognitoIdentity.CognitoUserAttribute[] => {
  return Object.keys(attributes).map(
    (key: string) =>
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: key,
        Value: (attributes as any)[key] ? (attributes as any)[key].toString() : '',
      }),
  );
};
/**
 * @description authenticateUser is a function used to authenticate the user and generate access token
 * @param  {Application} app represents express.js
 * @param  {AmazonCognitoIdentity.IAuthenticationDetailsData} authenticationData represents username and password
 * @param  {string} cognitoId represents user id in cognito
 * @returns {Promise} represents access token
 */
export const authenticateUser = (
  app: Application,
  authenticationData: AmazonCognitoIdentity.IAuthenticationDetailsData,
  cognitoId: string,
): Promise<string> => {
  const cognitoPool = app.get('cognito');
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userData = {
    Username: cognitoId,
    Pool: cognitoPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result) {
        resolve(result.getIdToken().getJwtToken());
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
};

/**
 * @description confirmCognitoUser is a function used to confirm cognito user
 * @param  {Application} app represents express app
 * @param  {string} email represents user email
 * @returns {Promise<string>}
 */
export const confirmCognitoUser = async (app: Application, email: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const cognitoProvider = app.get('cognitoProvider');

    const {
      cognito: {
        cognitoPoolConfig: { UserPoolId },
      },
    } = config;

    const confirmParams = {
      UserPoolId,
      Username: email,
    };
    cognitoProvider.adminConfirmSignUp(confirmParams, (error: any, data: any) => {
      if (error) reject(error.message);
      resolve(data);
    });
  });

/**
 * @description updateUserAttributes is a function used to update cognito user attributes
 * @param  {Application} app represents express app
 * @param  {string} email represents user email
 * @returns {Promise<string>}
 */
export const updateCognitoAttributes = async (app: Application, cognitoId: string, attributes: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const cognitoProvider = app.get('cognitoProvider');

    const {
      cognito: {
        cognitoPoolConfig: { UserPoolId },
      },
    } = config;

    const params = {
      UserAttributes: attributes,
      UserPoolId,
      Username: cognitoId,
    };
    cognitoProvider.adminUpdateUserAttributes(params, (error: any, data: any) => {
      if (error) reject(error.message);
      resolve(data);
    });
  });
