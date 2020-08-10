import joi from '@hapi/joi';
import { PayPalConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    PAYPAL_CLIENT_ID: joi.string().required(),
    PAYPAL_SECRET: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): PayPalConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    payPalClientId: envVars.PAYPAL_CLIENT_ID,
    payPalSecret: envVars.PAYPAL_SECRET,
  };
};

export default config;
