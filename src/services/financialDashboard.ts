import { Transaction } from 'sequelize/types';
import { FinancialDashboard } from '../database';
import { Filter } from '../interfaces';

export const getUserFinancialDahsboard = (filter: Filter, transaction: Transaction): Promise<any> => {
  return FinancialDashboard.findOne({ ...filter, transaction });
};
