export interface RakutenTransactionsAttributes {
  userId?: number;
  etransactionId: string;
  orderId: string;
  advertiserId: string;
  offerId: string;
  skuNumber: string;
  saleAmount: number;
  quantity: number;
  commissions: number;
  processDate: Date;
  transactionDate: Date;
  transactionType: string;
  productName: string;
  u1: string;
  currency: string;
  isEvent: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CommissionJunctionTransactionsAttributes {
  actionTrackerId: number;
  advertiserId: number;
  actionStatus: string;
  actionTrackerName: string;
  advertiserName: string;
  postingDate: string;
  pubCommissionAmountUsd: number;
  userId?: number;
  saleAmountUsd: number;
  correctionReason: string;
  orderDiscountUsd: number;
  aid: number;
  orderId: number;
  commissionId: number;
  saleAmountPubCurrency: number;
  orderDiscountPubCurrency: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CommissionJunctionDataItem {
  actionTrackerId: number;
  actionStatus: string;
  advertiserId: number;
  actionTrackerName: string;
  advertiserName: string;
  postingDate: string;
  pubCommissionAmountUsd: number;
  userId?: number;
  saleAmountUsd: number;
  correctionReason: string;
  orderDiscountUsd: number;
  aid: number;
  orderId: number;
  commissionId: number;
  saleAmountPubCurrency: number;
  orderDiscountPubCurrency: number;
}
export type CommissionJunctionData = Array<CommissionJunctionDataItem>;

export interface CommissionJunctionPayloadItem {
  actionTrackerId: number;
  actionStatus: string;
  advertiserId: number;
  actionTrackerName: string;
  advertiserName: string;
  postingDate: string;
  pubCommissionAmountUsd: string;
  shopperId?: number;
  saleAmountUsd: string;
  correctionReason: string;
  orderDiscountUsd: string;
  aid: number;
  orderId: number;
  commissionId: number;
  saleAmountPubCurrency: string;
  orderDiscountPubCurrency: string;
  eventDate?: string;
  lockingDate?: string;
  validationStatus?: string;
  reviewedStatus?: string;
  actionType?: string;
  source?: string;
  websiteId?: string;
  websiteName?: string;
  lockingMethod?: string;
  original?: boolean;
  originalActionId?: string;
  siteToStoreOffer?: string;
}

export type CommissionJunctionPayload = Array<CommissionJunctionPayloadItem>;

export interface ImpactRadiusAttributes {
  userId?: number;
  token?: string;
  campaignName: string;
  campaignId: string;
  actionTrackerId: string;
  actionId: string;
  status: string;
  statusDetail: string;
  adId: string;
  payout: number;
  deltaPayout: number;
  intendedPayout: number;
  amount: number;
  deltaAmount: number;
  intendedAmount: number;
  currency: string;
  originalCurrency: string;
  originalAmount: number;
  eventDate: Date;
  creationDate: Date;
  lockingDate: Date;
  clearedDate: Date;
  referringDomain: string;
  landingPageUrl: string;
  subId1: string;
  subId2: string;
  subId3: string;
  promoCode: string;
}

export interface FinancialDashboardAttributes {
  userId?: number;
  pending: number;
  receivableMilestone: number;
  earnings: number;
  lastClosedOut: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserTransactionsHistoryAttributes {
  userId: number;
  closedOut: number;
  paypalAccount: number;
  chirpyestCurrentBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UpdatePendingCashAttributes {
  commissions: number;
  saleAmount: number;
}

export interface BrandsAttributes {
  brandName: string;
  network: string;
  url: string;
  brandId: string;
  trackingLink: string;
  status: string;
  commission: string;
  category?: string;
  isTrending?: boolean;
  isDeleted?: boolean;
  isExpired?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UrlBrand {
  [key: string]: string | undefined;
}

export interface GenerateTrackableLinkAttributes {
  [key: string]: (args: UrlBrand) => string;
}
