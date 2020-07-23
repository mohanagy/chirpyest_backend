import joi from '@hapi/joi';
import { AffiliateNetworksConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    COMMISSION_JUNCTION_PUBLISHER_ID: joi.string().required(),
    COMMISSION_JUNCTION_PERSONAL_KEY: joi.string().required(),
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
    commissionJunctionConfig: {
      cJPublisherId: envVars.COMMISSION_JUNCTION_PUBLISHER_ID,
      cJPersonalKey: envVars.COMMISSION_JUNCTION_PERSONAL_KEY,
    },
    impactRadiusToken: envVars.IMPACT_RADIUS_TOKEN,
    rakutenToken: envVars.RAKUTEN_TOKEN,
  };
};

export default config;
