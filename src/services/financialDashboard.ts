import { Transaction } from 'sequelize/types';
import { FinancialDashboard } from '../database';
import { Filter, FinancialDashboardAttributes } from '../interfaces';
import { FinancialDashboardModel } from '../types/sequelize';

export const getUserFinancialDashboard = (
  filter: Filter,
  transaction: Transaction,
): Promise<FinancialDashboardAttributes | null> => {
  return FinancialDashboard.findOne({ ...filter, transaction });
};

export const updateUserFinicalDashboard = (
  data: any,
  filter: Filter,
  transaction: Transaction,
): Promise<[number, FinancialDashboardModel[]]> => {
  return FinancialDashboard.update(data, { ...filter, transaction });
};

export const incrementUserFinicalDashboard = (
  data: any,
  filter: Filter,
  transaction: Transaction,
): Promise<FinancialDashboardModel> => {
  return FinancialDashboard.increment(data, { ...filter, transaction });
};
