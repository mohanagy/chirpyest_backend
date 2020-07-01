import { Transaction } from 'sequelize';
/* eslint-disable no-underscore-dangle */
import { isNullOrUndefined } from 'util';
import * as database from '../database';
import { EditUserAttributes, Filter, UserAttributes } from '../interfaces';
import { UserModel } from '../types/sequelize';

const { Users } = database;

/**
 * @description getUser is a service used to find the user using filters
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<UserModel | null>} User data
 */
export const getUser = async (filter: Filter, transaction: Transaction): Promise<UserModel | null> => {
  return Users.findOne({ ...filter, transaction });
};

/**
 * @description isEmailExists is a service used to check if user exists or not
 * @param {string} email user email
 * @param {Transaction} transaction transaction
 * @return {Promise<boolean>} result of checking process
 */
export const isEmailExists = async (email: string, transaction: Transaction): Promise<boolean> => {
  const User = await Users.findOne({
    where: { email },
    transaction,
  });
  if (isNullOrUndefined(User)) return false;
  return true;
};

/**
 * @description createUser is a service used to create user
 * @param {UserAttributes} data represent user data
 * @param {Transaction} transaction transaction
 * @returns {Promise<UserModel | null>}
 */
export const createUser = async (data: UserAttributes, transaction: Transaction): Promise<UserModel | null> => {
  const userUserModel = await Users.create(data, { transaction });
  return userUserModel;
};

/**
 * @description updateUser is a service used in case we want to update user
 * @param {Filter} filter filtration
 * @param {EditUserAttributes} data represent new data for exist user
 * @param {Transaction} transaction
 * @return {Promise<[number, UserModel[]]}
 */
export const updateUser = async (
  filter: Filter,
  data: EditUserAttributes,
  transaction: Transaction,
): Promise<[number, UserModel[]]> => Users.update(data, { ...filter, transaction });

/**
 * @description findAllUsers service used to get all users
 * @param {Transaction} transaction
 * @return {Promise<UserModel[]>} list of all users
 */
export const findAllUsers = async (transaction: Transaction): Promise<UserModel[]> => {
  const data = await Users.findAll({
    transaction,
  });
  return data;
};

/**
 * @description findUser is a service to get user by sub
 * @param {Filter} filter filtration
 * @param {Transaction} transaction
 * @return {Promise<UserModel | null>} user object
 */
export const findUser = async (filter: Filter, transaction: Transaction): Promise<UserModel | null> =>
  Users.findOne({ ...filter, transaction });

/**
 *
 * @param filter
 * @param {Transaction} transaction
 */
export const deleteUser = async (filter: Filter, transaction: Transaction): Promise<number> => {
  const user = await Users.destroy({ ...filter, transaction });
  return user;
};
