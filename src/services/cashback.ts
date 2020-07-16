import { Transaction } from 'sequelize';
import { FinancialDashboard } from '../database';

/**
 *
 * @param userId The id for the user who will receive the cashback
 * @param data Cashback amount related data
 * @param transaction transaction object
 */

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
