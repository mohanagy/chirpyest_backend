import { Transaction } from 'sequelize';
import * as database from '../database';
import { calculateUserPendingCash } from '../helpers';
import { EditUserAttributes, Filter, UserAttributes } from '../interfaces';
import { UserModel } from '../types/sequelize';

const { Users, FinancialDashboard } = database;

/**
 * @description getUser is a service used to find the user using filters
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<UserModel | null>} User data
 */
export const getUser = async (filter: Filter, transaction?: Transaction): Promise<UserModel | null> => {
  const user = await Users.findOne({ ...filter, transaction, include: [FinancialDashboard] });
  if (user && user.financialDashboard) {
    const pendingDollars = calculateUserPendingCash(user.financialDashboard.pending);
    const earningsDollars = calculateUserPendingCash(user.financialDashboard.earnings);
    const lastClosedOutDollars = calculateUserPendingCash(user.financialDashboard.lastClosedOut);
    const receivableMilestoneDollars = calculateUserPendingCash(user.financialDashboard.receivableMilestone);
    user.financialDashboard.pending = pendingDollars;
    user.financialDashboard.earnings = earningsDollars;
    user.financialDashboard.lastClosedOut = lastClosedOutDollars;
    user.financialDashboard.receivableMilestone = receivableMilestoneDollars;
  }
  return user;
};

/**
 * @description isEmailExists is a service used to check if user exists or not
 * @param {string} email user email
 * @param {Transaction} transaction transaction
 * @return {Promise<boolean>} result of checking process
 */
export const isEmailExists = async (email: string, transaction?: Transaction): Promise<boolean> => {
  const User = await Users.findOne({
    where: { email },
    transaction,
  });
  if (User === null || User === undefined) return false;
  return true;
};

/**
 * @description createUser is a service used to create user
 * @param {UserAttributes} data represent user data
 * @param {Transaction} transaction transaction
 * @returns {Promise<UserModel | null>}
 */
export const createUser = async (data: UserAttributes, transaction?: Transaction): Promise<UserModel> => {
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
  transaction?: Transaction,
): Promise<[number, UserModel[]]> => Users.update(data, { ...filter, transaction, returning: true });

/**
 * @description findAllUsers service used to get all users
 * @param {Transaction} transaction
 * @return {Promise<UserModel[]>} list of all users
 */
export const findAllUsers = async (transaction?: Transaction): Promise<UserModel[]> => {
  const data = await Users.findAll({
    transaction,
    include: [FinancialDashboard],
  });
  return data;
};

/**
 * @description findUser is a service to get user by conditions
 * @param {Filter} filter filtration
 * @param {Transaction} transaction
 * @return {Promise<UserModel | null>} user object
 */
export const findUser = async (filter: Filter, transaction?: Transaction): Promise<UserModel | null> =>
  Users.findOne({ ...filter, transaction, include: [FinancialDashboard] });

/**
 * @description deleteUser is a service to  delete a user
 * @param {Filter} filter filtration
 * @param {Transaction} transaction
 * @return {Promise<number>}
 */
export const deleteUser = async (filter: Filter, transaction?: Transaction): Promise<number> => {
  const user = await Users.destroy({ ...filter, transaction });
  return user;
};

/**
 * @description disableUser is a service to  delete a user
 * @param {Filter} filter filtration
 * @param {Transaction} transaction
 * @return {Promise<number>}
 */
export const disableUser = async (filter: Filter, transaction?: Transaction): Promise<[number, UserModel[]]> => {
  const user = await Users.update(
    {
      isActive: database.default.Sequelize.literal('NOT is_active'),
    },
    { ...filter, transaction },
  );
  return user;
};
