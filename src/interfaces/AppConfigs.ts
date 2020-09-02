import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import jwkToPem from 'jwk-to-pem';

export interface DatabaseConfigs {
  url: string;
}

export interface ServerConfigs {
  port: string;
  SentryDNS: string;
  dataDogApiKey: string;
  host: string;
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
  awsS3AccessKeyId: string;
  awsS3SecretAccessKey: string;
}
export interface CognitoConfigs {
  cognitoPoolConfig: ICognitoUserPoolData;
  jwt: jwkToPem.JWK;
  awsConfigs: AwsConfigs;
}

export interface CognitoAttributes {
  name: string;
  email: string;
  'custom:user_id': string;
  picture: string;
}

export interface CognitoUser {
  userSub: string;
}

export interface Database {
  sequelize?: any;
  Sequelize?: any;
}

export interface PayPalConfigs {
  payPalClientId: string;
  payPalSecret: string;
}
