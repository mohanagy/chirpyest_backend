import joi from '@hapi/joi';
import { ServerConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    SENTRY_DNS: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): ServerConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    port: envVars.PORT,
    SentryDNS: envVars.SENTRY_DNS,
  };
};

export default config;
