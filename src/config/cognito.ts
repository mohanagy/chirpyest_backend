import joi from '@hapi/joi';
import { CognitoConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    COGNITO_USER_POOL_ID: joi.string().required(),
    COGNITO_CLIENT_ID: joi.string().required(),
    COGNITO_REGION: joi.string().required(),
    JWT_KID: joi.string().required(),
    JWT_N: joi.string().required(),
    JWT_USE: joi.string().required(),
    JWT_KTY: joi.string().required(),
    JWT_ALG: joi.string().required(),
    JWT_E: joi.string().required(),
    AWS_ACCESS_KEY_ID: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): CognitoConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    cognitoPoolConfig: {
      UserPoolId: envVars.COGNITO_USER_POOL_ID,
      ClientId: envVars.COGNITO_CLIENT_ID,
    },
    // as a reference for understanding the variables check:  https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
    jwt: {
      alg: envVars.JWT_ALG,
      e: envVars.JWT_E,
      kid: envVars.JWT_KID,
      kty: envVars.JWT_KTY,
      n: envVars.JWT_N,
      use: envVars.JWT_USE,
    },
    awsConfigs: {
      accessKeyId: envVars.AWS_ACCESS_KEY_ID,
      secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
      region: envVars.COGNITO_REGION,
    },
  };
};

export default config;
