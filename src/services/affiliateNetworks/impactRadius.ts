import { Transaction } from 'sequelize';
import { ImpactRadiusTransactions } from '../../database';
import { ImpactRadiusAttributes } from '../../interfaces/Networks';
import { ImpactRadiusTransactionsModel } from '../../types/sequelize';

/**
 * @description createImpactRadiusTransaction is a service used to save impactRadius webhook data to the db
 * @param {ImpactRadiusAttributes} data represents the api data
 * @param {Transaction} transaction transaction
 * @returns {Promise<ImpactRadiusTransactionsModel | null>}
 */
export const createImpactRadiusTransaction = (
  data: ImpactRadiusAttributes,
  transaction: Transaction,
): Promise<ImpactRadiusTransactionsModel> => ImpactRadiusTransactions.create(data, { transaction });
