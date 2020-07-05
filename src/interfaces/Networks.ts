export interface RakutenTransactionsAttributes {
  userId: number;
  transactionId: string;
  advertiserId: string;
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
