import joi from '@hapi/joi';
import { DatabaseConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): DatabaseConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    url: envVars.DATABASE_URL,
  };
};

export default config;
