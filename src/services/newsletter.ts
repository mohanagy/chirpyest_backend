import { Transaction } from 'sequelize/types';
import { NewsletterModel } from '../types/sequelize';
import { Newsletter } from '../database';
import { Filter } from '../interfaces';

/**
 * @description getUserSubscribe is a service used to check if the user already subscribed or not
 * @param  {Filter} filter
 * @param  {Transaction} transaction
 * @returns Promise
 */
export const getUserSubscribe = (filter: Filter, transaction: Transaction): Promise<NewsletterModel | null> => {
  return Newsletter.findOne({ ...filter, transaction });
};

/**
 * @description subscribeUser is a service used to create a record for the user in the newsletter table
 * @param  {any} data
 * @param  {Transaction} transaction
 * @returns Promise
 */
export const subscribeUser = (data: any, transaction: Transaction): Promise<NewsletterModel> => {
  return Newsletter.create(data, {
    transaction,
  });
};

/**
 * @description updateUserSubscribe is a service used to update the subscribe for the user in the newsletter table
 * @param  {Filter} filter
 * @param  {any} data
 * @param  {Transaction} transaction
 * @returns Promise
 */
export const updateUserSubscribe = (
  filter: Filter,
  data: any,
  transaction: Transaction,
): Promise<[number, NewsletterModel[]]> => {
  return Newsletter.update(data, {
    transaction,
    ...filter,
  });
};
