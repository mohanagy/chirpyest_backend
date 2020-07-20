import { FinancialDashboard } from '../database';
import { Filter } from '../interfaces';

export const getUserFinancialDahsboard = (filter: Filter): Promise<any> => {
  return FinancialDashboard.findOne({ ...filter });
};
