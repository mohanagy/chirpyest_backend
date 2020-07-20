export interface RakutenTransactionsAttributes {
  userId?: number;
  etransactionId: string;
  orderId: string;
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

export interface ImpactRadiusAttributes {
  userId?: number;
  token?: string;
  campaignName: string;
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
  userId: number;
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
