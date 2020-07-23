import { FinancialDashboard } from '..';

const user1FinancialDashboard: any = {
  userId: 1,
  pending: 0,
  receivableMilestone: 0,
  earnings: 0,
  lastClosedOut: 0,
};

export const createFinancialDashboardRecords = (): Promise<any> => {
  return FinancialDashboard.bulkCreate([user1FinancialDashboard]);
};
