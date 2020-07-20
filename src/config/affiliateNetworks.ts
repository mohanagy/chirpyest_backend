import joi from '@hapi/joi';
import { AffiliateNetworksConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    IMPACT_RADIUS_TOKEN: joi.string().required(),
    RAKUTEN_TOKEN: joi.string().required(),
  })
  .unknown()
  .required();

const config = (): AffiliateNetworksConfigs => {
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    impactRadiusToken: envVars.IMPACT_RADIUS_TOKEN,
    rakutenToken: envVars.RAKUTEN_TOKEN,
  };
};

export default config;
