import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';

export interface DatabaseConfigs {
  url: string;
}

export interface ServerConfigs {
  port: string;
}

export interface JWT {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
export interface AwsConfigs {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}
export interface CognitoConfigs {
  cognitoPoolConfig: ICognitoUserPoolData;
  jwt: JWT;
  awsConfigs: AwsConfigs;
}

export interface CognitoAttributes {
  name: string;
  email: string;
  'custom:user_id': string;
}

export interface CognitoUser {
  userSub: string;
}

export interface Database {
  sequelize?: any;
  Sequelize?: any;
}
