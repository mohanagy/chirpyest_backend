import joi from '@hapi/joi';
import { AffiliateNetworksConfigs } from '../interfaces';

const envVarsSchema = joi
  .object({
    COMMISSION_JUNCTION_PUBLISHER_ID: joi.string().required(),
    COMMISSION_JUNCTION_PERSONAL_KEY: joi.string().required(),
    RAKUTEN_TOKEN: joi.string().required(), // webhook token
    RAKUTEN_SECURITY_TOKEN: joi.string().required(),
    IMPACT_RADIUS_TOKEN: joi.string().required(), // webhook token
    IMPACT_RADIUS_ACCOUNT_SID: joi.string().required(),
    IMPACT_RADIUS_AUTH_TOKEN: joi.string().required(),
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
    rakutenConfig: {
      securityToken: envVars.RAKUTEN_SECURITY_TOKEN,
      webhookToken: envVars.RAKUTEN_TOKEN, // TODO: rename this
    },
    impactRadiusConfig: {
      webhookToken: envVars.IMPACT_RADIUS_TOKEN, // TODO: rename this
      accountSID: envVars.IMPACT_RADIUS_ACCOUNT_SID, // TODO: rename this
      authToken: envVars.IMPACT_RADIUS_AUTH_TOKEN, // TODO: rename this
    },
  };
};

export default config;
