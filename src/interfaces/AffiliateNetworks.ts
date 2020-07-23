export interface CommissionJunction {
  cJPublisherId: string;
  cJPersonalKey: string;
}

export interface AffiliateNetworksConfigs {
  commissionJunctionConfig: CommissionJunction;
  impactRadiusToken: string;
  rakutenToken: string;
}
