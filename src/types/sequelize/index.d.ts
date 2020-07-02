/* eslint-disable max-classes-per-file */
import { BuildOptions, Model } from 'sequelize';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): UserModel;
};

export interface RakutenTransactionsModel extends Model<RakutenTransactionsAttributes>, RakutenTransactionsAttributes {}
export class RakutenTransactions extends Model<RakutenTransactionsModel, RakutenTransactionsAttributes> {}
export type RakutenTransactionsStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): RakutenTransactionsModel;
};

export interface FinancialDashboardModel extends Model<FinancialDashboardAttributes>, FinancialDashboardAttributes {}
export class FinancialDashboard extends Model<FinancialDashboardModel, FinancialDashboardAttributes> {}
export type FinancialDashboardStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): FinancialDashboardModel;
};

export interface UserTransactionsHistoryModel
  extends Model<UserTransactionsHistoryAttributes>,
    UserTransactionsHistoryAttributes {}
export class UserTransactionsHistory extends Model<UserTransactionsHistoryModel, UserTransactionsHistoryAttributes> {}
export type UserTransactionsHistoryStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): UserTransactionsHistoryModel;
};
