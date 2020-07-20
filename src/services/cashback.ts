import { Transaction } from 'sequelize';
import { FinancialDashboard } from '../database';
import { constants } from '../helpers';
import { Filter, FinancialDashboardAttributes } from '../interfaces';

/**
 * @description incrementRecord will increment specific field by the amount
 * @param {String} field The field to increment
 * @param {Number} amount The amount to increment by
 * @param {Object} filter The filter object
 * @param {Transaction} transaction transaction object
 * @return {Promise<FinancialDashboardAttributes>}
 */

export const incrementRecord = async (
  field: any,
  amount: number,
  filter: Filter,
  transaction: Transaction,
): Promise<FinancialDashboardAttributes> => {
  return FinancialDashboard.increment(field, {
    ...filter,
    by: amount,
    transaction,
  });
};

/**
 * @description createFinancialRecord will create a new FinancialRecord for the user
 * @param {FinancialDashboardAttributes} data FinancialDashboard record data
 * @param {Transaction} transaction transaction object
 * @return {Promise<FinancialDashboardAttributes>}
 */

export const createFinancialRecord = async (
  data: FinancialDashboardAttributes,
  transaction: Transaction,
): Promise<FinancialDashboardAttributes> => {
  return FinancialDashboard.create(data, { transaction });
};

/**
 * @description updatePendingCash will increment/create the user pending cash
 * @param {Number} userId The id for the user who will receive the cashback
 * @param {Number} commissionAmount Cashback amount
 * @param {Transaction} transaction transaction object
 * @return {Promise<FinancialDashboardAttributes>}
 */

export const updatePendingCash = async (
  userId: number,
  filter: Filter,
  commissionAmount: number,
  transaction: Transaction,
): Promise<FinancialDashboardAttributes> => {
  const [[, affectedCount]]: any = await incrementRecord(
    constants.messages.general.pendingField,
    commissionAmount,
    filter,
    transaction,
  );
  if (affectedCount > 0) {
    return affectedCount;
  }

  const financialRecord = {
    userId,
    pending: commissionAmount,
    receivableMilestone: 0.0,
    earnings: 0.0,
    lastClosedOut: 0.0,
  };

  const financial = await createFinancialRecord(financialRecord, transaction);

  return financial;
};
