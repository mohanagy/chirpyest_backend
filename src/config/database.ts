import joi from '@hapi/joi';

const envVarsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    DATABASE_URL_TEST: joi.string().when('NODE_ENV', {
      is: 'test',
      then: joi.string().required(),
    }),
  })
  .unknown()
  .required();

interface DatabaseConfigs {
  url: string;
}

const config = (): DatabaseConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    url: envVars.NODE_ENV === 'test' ? envVars.DATABASE_URL_TEST : envVars.DATABASE_URL,
  };
};

export default config;
