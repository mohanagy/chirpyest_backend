import joi from '@hapi/joi';
import { BrandsConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    REBRANDLY_API_KEY: joi.string().required(),
    REBRANDLY_WORKSPACE: joi.string().required(),
    REBRANDLY_DOMAIN: joi.string().required(),
    REBRANDLY_ENDPOINT: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): BrandsConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    rebrandlyApiKey: envVars.REBRANDLY_API_KEY,
    rebrandlyWorkspace: envVars.REBRANDLY_WORKSPACE,
    rebrandlyDomain: envVars.REBRANDLY_DOMAIN,
    rebrandlyEndpoint: envVars.REBRANDLY_ENDPOINT,
  };
};

export default config;
