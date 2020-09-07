export interface CommissionJunction {
  cJPublisherId: string;
  cJPersonalKey: string;
}

export interface Rakuten {
  securityToken: string;
  webhookToken: string;
  accountUsername: string;
  accountPassword: string;
  apiScope: string;
  webApiToken: string;
}

export interface ImpactRadius {
  webhookToken: string;
  accountSID: string;
  authToken: string;
  account2SID: string;
  authToken2: string;
}

export interface AffiliateNetworksConfigs {
  commissionJunctionConfig: CommissionJunction;
  rakutenConfig: Rakuten;
  impactRadiusConfig: ImpactRadius;
}
export interface BrandsConfigs {
  rebrandlyApiKey: string;
  rebrandlyWorkspace: string;
  rebrandlyDomain: string;
  rebrandlyEndpoint: string;
}
