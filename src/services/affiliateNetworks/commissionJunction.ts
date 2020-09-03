import { Transaction } from 'sequelize';
import { CommissionJunctionTransactions } from '../../database';
import { CommissionJunctionTransactionsAttributes } from '../../interfaces/Networks';
import { CommissionJunctionModel } from '../../types/sequelize';

/**
 * @description createBulkCommissionJunctionTransactions is a service used to save Commission Junction webhook data to the db
 * @param {CommissionJunctionTransactionsAttributes[]} data represents the api data
 * @param {Transaction} transaction transaction
 * @returns {Promise<CommissionJunctionModel | null>}
 */
export const createBulkCommissionJunctionTransactions = (
  data: CommissionJunctionTransactionsAttributes[],
  transaction: Transaction,
): Promise<CommissionJunctionModel[]> =>
  CommissionJunctionTransactions.bulkCreate(data, { transaction, updateOnDuplicate: ['updatedAt'] });

/**
 * @description findAllCommissionJunctionTransactions is a service used to get all Commission Junction transaction
 * @param {Object} filter filtration data
 * @param {Transaction} transaction transaction
 * @returns {Promise<CommissionJunctionModel | null>}
 */
export const findAllCommissionJunctionTransactions = (
  filter: any,
  transaction: Transaction,
): Promise<CommissionJunctionModel[]> =>
  CommissionJunctionTransactions.findAll({
    ...filter,
    transaction,
    raw: true,
  });
