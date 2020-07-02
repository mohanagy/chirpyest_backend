import { Transaction } from 'sequelize';
import { FinancialDashboard, RakutenTransactions } from '../database';
import { RakutenTransactionsModel } from '../types/sequelize';

/**
 * @description createRakutenTransaction is a service used to save rekuten webhook data to the db
 * @param {RakutenTransactionsAttributes} data represent user data
 * @param {Transaction} transaction transaction
 * @returns {Promise<RakutenTransactionsModel | null>}
 */
export const createRakutenTransaction = (
  data: RakutenTransactionsModel,
  transaction: Transaction,
): Promise<RakutenTransactionsModel> => {
  return RakutenTransactions.create(data, { transaction });
};

// match by userId
// call function to calculate the user commission from the overall amount
// increase the user pending by the calculated amount
// const data = { commissions: 50, sale_amount: 60 };
const calculateCommission = (data: any) => {
  return data.commissions / 2;
};

export const updatePendingCash = (userId: any, data: any) => {
  const userCommission = calculateCommission(data);
  return FinancialDashboard.increment('pending', { by: userCommission, where: { user_id: userId } });
};
