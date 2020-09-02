import { Transaction } from 'sequelize';
import { ImpactRadiusTransactions } from '../../database';
import { ImpactRadiusAttributes } from '../../interfaces/Networks';
import { ImpactRadiusTransactionsModel } from '../../types/sequelize';

/**
 * @description createImpactRadiusTransaction is a service used to save impactRadius webhook data to the db
 * @param {ImpactRadiusAttributes} data The data to be saved from Impact Radius hooks
 * @param {Transaction} transaction transaction
 * @returns {Promise<ImpactRadiusTransactionsModel | null>}
 */
export const createImpactRadiusTransaction = (
  data: ImpactRadiusAttributes,
  transaction: Transaction,
): Promise<ImpactRadiusTransactionsModel> => ImpactRadiusTransactions.create(data, { transaction });

/**
 * @description findAllImpactRadiusTransactions is a service used to get all Impact Radius transactions
 * @param {Object} filter filtration data
 * @param {Transaction} transaction transaction
 * @returns {Promise<ImpactRadiusTransactionsModel | null>}
 */
export const findAllImpactRadiusTransactions = (
  filter: any,
  transaction: Transaction,
): Promise<ImpactRadiusTransactionsModel[]> =>
  ImpactRadiusTransactions.findAll({
    ...filter,
    transaction,
    raw: true,
  });
