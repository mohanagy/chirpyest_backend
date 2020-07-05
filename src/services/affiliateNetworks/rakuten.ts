import { Transaction } from 'sequelize';
import { FinancialDashboard, RakutenTransactions } from '../../database';
import { RakutenTransactionsModel } from '../../types/sequelize';
import { calculateCommission } from './utils';

/**
 * @description createRakutenTransaction is a service used to save rekuten webhook data to the db
 * @param {RakutenTransactionsAttributes} data represent the api data
 * @param {Transaction} transaction transaction
 * @returns {Promise<RakutenTransactionsModel | null>}
 */
export const createRakutenTransaction = (
  data: RakutenTransactionsModel,
  transaction: Transaction,
): Promise<RakutenTransactionsModel> => RakutenTransactions.create(data, { transaction });

export const updatePendingCash = async (userId: number, data: any, transaction: Transaction): Promise<any> => {
  const userCommission = calculateCommission(data.commissions);

  const [[, affectedCount]]: any = await FinancialDashboard.increment('pending', {
    by: userCommission,
    where: { userId },
    transaction,
  });

  if (affectedCount > 0) {
    return affectedCount;
  }

  const financial = await FinancialDashboard.create(
    {
      userId,
      pending: userCommission,
      receivableMilestone: 0.0,
      earnings: 0.0,
      lastClosedOut: 0.0,
    },
    { transaction },
  );
  return financial;
};
