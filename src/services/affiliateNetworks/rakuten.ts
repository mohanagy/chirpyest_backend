import { Transaction } from 'sequelize';
import { FinancialDashboard, RakutenTransactions } from '../../database';
import { RakutenTransactionsAttributes } from '../../interfaces/Networks';
import { RakutenTransactionsModel } from '../../types/sequelize';

/**
 * @description createRakutenTransaction is a service used to save rekuten webhook data to the db
 * @param {RakutenTransactionsAttributes} data represents the api data
 * @param {Transaction} transaction transaction
 * @returns {Promise<RakutenTransactionsModel | null>}
 */
export const createRakutenTransaction = (
  data: RakutenTransactionsAttributes,
  transaction: Transaction,
): Promise<RakutenTransactionsModel> => RakutenTransactions.create(data, { transaction });

export const updatePendingCash = async (userId: number, data: any, transaction: Transaction): Promise<any> => {
  const userCommission = data.pendingCash;

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
