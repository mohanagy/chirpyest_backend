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
    IMPACT_RADIUS2_ACCOUNT_SID: joi.string().required(),
    IMPACT_RADIUS2_AUTH_TOKEN: joi.string().required(),
    RAKUTEN_ACCOUNT_USERNAME: joi.string().required(),
    RAKUTEN_ACCOUNT_PASSWORD: joi.string().required(),
    RAKUTEN_SCOPE: joi.string().required(),
    RAKUTEN_EVENTS_API_TOKEN: joi.string().required(),
    RAKUTEN_REPORT_TOKEN: joi.string().required(),
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
      webhookToken: envVars.RAKUTEN_TOKEN,
      accountUsername: envVars.RAKUTEN_ACCOUNT_USERNAME,
      accountPassword: envVars.RAKUTEN_ACCOUNT_PASSWORD,
      apiScope: envVars.RAKUTEN_SCOPE,
      webApiToken: envVars.RAKUTEN_EVENTS_API_TOKEN,
      rakutenReportToken: envVars.RAKUTEN_REPORT_TOKEN,
    },
    impactRadiusConfig: {
      webhookToken: envVars.IMPACT_RADIUS_TOKEN,
      accountSID: envVars.IMPACT_RADIUS_ACCOUNT_SID,
      authToken: envVars.IMPACT_RADIUS_AUTH_TOKEN,
      account2SID: envVars.IMPACT_RADIUS2_ACCOUNT_SID,
      authToken2: envVars.IMPACT_RADIUS2_AUTH_TOKEN,
    },
  };
};

export default config;
