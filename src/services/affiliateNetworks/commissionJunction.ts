import { Transaction } from 'sequelize';
import { CommissionJunctionTransactions } from '../../database';
import { CommissionJunctionTransactionsAttributes } from '../../interfaces/Networks';
import { CommissionJunctionModel } from '../../types/sequelize';

/**
 * @description createBulkCommissionJunctionTransactions is a service used to save Commission Junction webhook data to the db
 * @param {v} data represents the api data
 * @param {Transaction} transaction transaction
 * @returns {Promise<RakutenTransactionsModel | null>}
 */
export const createBulkCommissionJunctionTransactions = (
  data: CommissionJunctionTransactionsAttributes[],
  transaction: Transaction,
): Promise<CommissionJunctionModel[]> =>
  CommissionJunctionTransactions.bulkCreate(data, { transaction, updateOnDuplicate: ['updatedAt'] });
