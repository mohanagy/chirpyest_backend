import { Transaction } from 'sequelize';
import { RakutenTransactions } from '../../database';
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
