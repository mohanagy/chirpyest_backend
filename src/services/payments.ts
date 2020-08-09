import { Transaction } from 'sequelize';
import * as database from '../database';
import { PaymentsAttributes } from '../interfaces';

const { Payments } = database;

/**
 * @description getUser is a service used to find the user using filters
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes>} User data
 */
export const createBulkPayments = (
  data: Array<PaymentsAttributes>,
  transaction?: Transaction,
): Promise<PaymentsAttributes[]> => {
  return Payments.bulkCreate(data, { transaction, updateOnDuplicate: ['updatedAt'] });
};
