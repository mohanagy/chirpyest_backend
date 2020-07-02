export interface RakutenTransactionsAttributes {
  user_id: number;
  transaction_id: string;
  advertiser_id: string;
  order_id: string;
  offer_id: string;
  sku_number: string;
  sale_amount: number;
  quantity: number;
  commissions: number;
  process_date: Date;
  transaction_date: Date;
  transaction_type: string;
  product_name: string;
  u1: string;
  currency: string;
  is_event: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialDashboardAttributes {
  user_id: number;
  pending: number;
  receivable_milestone: number;
  earnings: number;
  last_closed_out: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserTransactionsHistoryAttributes {
  user_id: number;
  closed_out: number;
  paypal_account: number;
  chirpyest_current_balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
