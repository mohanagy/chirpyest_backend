import { Transaction } from 'sequelize';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { URL } from 'url';
import moment from 'moment';
import { ImpactRadiusTransactions } from '../../database';
import { ImpactRadiusAttributes } from '../../interfaces/Networks';
import { ImpactRadiusTransactionsModel } from '../../types/sequelize';
import { constants, dto } from '../../helpers';
import * as usersServices from '../users';

/**
 * @description createImpactRadiusTransaction is a service used to save impactRadius webhook data to the db
 * @param {ImpactRadiusAttributes} data The data to be saved from Impact Radius hooks
 * @param {Transaction} transaction transaction
 * @returns {Promise<ImpactRadiusTransactionsModel | null>}
 */
export const createImpactRadiusTransaction = (
  data: ImpactRadiusAttributes,
  transaction: Transaction,
): Promise<ImpactRadiusTransactionsModel | any> => ImpactRadiusTransactions.upsert(data, { transaction });

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

const { impactRadiusActionsListEndpint1, impactRadiusActionsListEndpint2 } = constants;

export const getImpactRadiusActions = async (paymentReportEndpoint: string, _type: string): Promise<any> => {
  const paymentReportEndpointParsed = new URL(paymentReportEndpoint);
  const last30Days = moment().startOf('day').subtract(30, 'days').format('YYYY-MM-DD');
  const today = moment().format('YYYY-MM-DD');
  paymentReportEndpointParsed.searchParams.set('START_DATE', last30Days);
  paymentReportEndpointParsed.searchParams.set('END_DATE', today);
  const {
    data: { Actions },
  } = await axios.get(paymentReportEndpointParsed.href);

  return Actions;
};

export const getImpactRadiusBothAccountsActions = async (): Promise<Array<any>> => {
  const account1Actions = getImpactRadiusActions(impactRadiusActionsListEndpint1, 'IR');
  const account2Actions = getImpactRadiusActions(impactRadiusActionsListEndpint2, 'IR2');
  const bothActions = await Promise.all([account1Actions, account2Actions]);
  const allImpactRadiusActions = bothActions.flat();
  const actionsCamelCase = camelcaseKeys(allImpactRadiusActions);
  return actionsCamelCase;
};

export const createBulkImpactRadiusTransactions = (
  data: ImpactRadiusAttributes[],
  transaction: Transaction,
): Promise<ImpactRadiusTransactionsModel[]> =>
  ImpactRadiusTransactions.bulkCreate(data, { transaction, ignoreDuplicates: true });

export const saveImpactRadiusActionsToDatabase = async (transaction: Transaction): Promise<any> => {
  const actions = await getImpactRadiusBothAccountsActions();
  const cleanActions = actions.map((action) => dto.impactRadiusDTO.impactRadiusActions(action));
  const users = await usersServices.findAllUsers(transaction);

  const modifiedActions = cleanActions.map((row) => {
    const modifiedRow = { ...row };
    if (row.userId && Number.isInteger(+row.userId)) {
      const userData = users.find((user) => user.id === row.userId);
      if (userData) {
        return modifiedRow;
      }
    }
    modifiedRow.userId = undefined;
    return modifiedRow;
  });

  const createdActions = await createBulkImpactRadiusTransactions(modifiedActions, transaction);
  return createdActions;
};
