import joi from '@hapi/joi';
import { EmailsConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    SMTP_SERVER: joi.string().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASSWORD: joi.string().required(),
    SMTP_PORT: joi.number().required(),
    SEND_GRID_KEY: joi.string().required(),
    SEND_GRID_FROM: joi.string().required(),
    SEND_GRID_TO: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): EmailsConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    smtpServer: envVars.SMTP_SERVER,
    smtpUser: envVars.SMTP_USER,
    smtpPassword: envVars.SMTP_PASSWORD,
    smtpPort: envVars.SMTP_PORT,
    sendGridKey: envVars.SEND_GRID_KEY,
    sendGridFrom: envVars.SEND_GRID_FROM,
    sendGridTo: envVars.SEND_GRID_TO,
  };
};

export default config;
