import { Transaction } from 'sequelize';
import * as database from '../database';
import { Filter, PaymentsTransactionsAttributes } from '../interfaces';
import { PaymentsTransactionsModel } from '../types/sequelize';

const { PaymentsTransactions } = database;

/**
 * @description getAllPaymentsTransactions is a service used to find all affiliate Network transactions depends on filter
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes[]>} PaymentsTransactionsModel data
 */
export const getAllPaymentsTransactions = (
  filter: Filter,
  transaction?: Transaction,
): Promise<PaymentsTransactionsAttributes[]> => {
  return PaymentsTransactions.findAll({ ...filter, transaction, raw: true });
};

/**
 * @description updatePaymentsTransactions is a service used to update  transactions  record
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes[]>} PaymentsTransactionsModel data
 */
export const updatePaymentsTransactions = (
  filter: Filter,
  data: Partial<PaymentsTransactionsAttributes>,
  transaction?: Transaction,
): Promise<[number, PaymentsTransactionsModel[]]> => {
  return PaymentsTransactions.update(data, { transaction, ...filter, returning: true });
};
