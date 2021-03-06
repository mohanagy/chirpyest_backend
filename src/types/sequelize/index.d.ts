/* eslint-disable max-classes-per-file */
import { BuildOptions, Model } from 'sequelize';
import {
  BrandsAttributes,
  CommissionJunctionTransactionsAttributes,
  FinancialDashboardAttributes,
  ImpactRadiusAttributes,
  PaymentsAttributes,
  PaymentsTransactionsAttributes,
  RakutenTransactionsAttributes,
  UserAttributes,
  UserTransactionsHistoryAttributes,
  NewsletterAttributes,
} from '../../interfaces';

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

export interface ImpactRadiusTransactionsModel extends Model<ImpactRadiusAttributes>, ImpactRadiusAttributes {}
export class ImpactRadiusTransactions extends Model<ImpactRadiusTransactionsModel, ImpactRadiusAttributes> {}
export type ImpactRadiusTransactionsStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): ImpactRadiusTransactionsModel;
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

export interface CommissionJunctionModel
  extends Model<CommissionJunctionTransactionsAttributes>,
    CommissionJunctionTransactionsAttributes {}
export class CommissionJunction extends Model<CommissionJunctionModel, CommissionJunctionTransactionsAttributes> {}
export type CommissionJunctionStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): CommissionJunctionModel;
};

export interface BrandsModel extends Model<BrandsAttributes>, BrandsAttributes {}
export class Brands extends Model<BrandsModel, BrandsAttributes> {}
export type BrandsStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): BrandsModel;
};

export interface PaymentsModel extends Model<PaymentsAttributes>, PaymentsAttributes {}
export class Payments extends Model<PaymentsModel, PaymentsAttributes> {}
export type PaymentsStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): PaymentsModel;
};

export interface PaymentsTransactionsModel
  extends Model<PaymentsTransactionsAttributes>,
    PaymentsTransactionsAttributes {}
export class PaymentsTransactions extends Model<PaymentsTransactionsModel, PaymentsTransactionsAttributes> {}
export type PaymentsTransactionsStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): PaymentsTransactionsModel;
};

export interface NewsletterModel extends Model<NewsletterAttributes>, NewsletterAttributes {}
export class Newsletter extends Model<NewsletterModel, NewsletterAttributes> {}
export type NewsletterStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): NewsletterModel;
};
