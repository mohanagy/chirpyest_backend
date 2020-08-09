import { Transaction } from 'sequelize/types';
import { FinancialDashboard } from '../database';
import { Filter, FinancialDashboardAttributes } from '../interfaces';

export const getUserFinancialDashboard = (
  filter: Filter,
  transaction: Transaction,
): Promise<FinancialDashboardAttributes | null> => {
  return FinancialDashboard.findOne({ ...filter, transaction });
};
