import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import aws from 'aws-sdk';
import { Application } from 'express';
import config from '../config';

/** cognito is a function used to initialize the cognito service
 *  @param {object} app - server
 *  @return {void} doesn't return anything
 */
export default (app: Application): void => {
  const {
    cognito: { cognitoPoolConfig, awsConfigs },
  } = config;
  const cognitoPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoPoolConfig);
  const cognitoProvider = new aws.CognitoIdentityServiceProvider(awsConfigs);
  app.set('cognito', cognitoPool);
  app.set('cognitoProvider', cognitoProvider);
};
