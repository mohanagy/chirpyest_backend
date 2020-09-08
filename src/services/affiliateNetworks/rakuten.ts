import { Transaction } from 'sequelize';
import qs from 'qs';
import axios from 'axios';
import moment from 'moment';
import { RakutenTransactions } from '../../database';
import { RakutenTransactionsAttributes } from '../../interfaces/Networks';
import { RakutenTransactionsModel } from '../../types/sequelize';
import config from '../../config';
import { dto } from '../../helpers';
import * as usersServices from '../users';

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

/**
 * @description findAllRakutenTransactions is a service used to get all Rakuten transactions
 * @param {Object} filter filtration data
 * @param {Transaction} transaction transaction
 * @returns {Promise<RakutenTransactionsModel | null>}
 */
export const findAllRakutenTransactions = (
  filter: any,
  transaction: Transaction,
): Promise<RakutenTransactionsModel[]> =>
  RakutenTransactions.findAll({
    ...filter,
    transaction,
    raw: true,
  });

export const getRakutenEvents = async (): Promise<any> => {
  const rakutenApiBaseUrl = 'https://api.rakutenmarketing.com';
  const eventsEndpoint = `${rakutenApiBaseUrl}/events/1.0/transactions`;
  const tokenEndpoint = `${rakutenApiBaseUrl}/token`;
  const eventsEndpointParsed = new URL(eventsEndpoint);
  const last30Days = moment().startOf('day').subtract(30, 'days').format('YYYY-MM-DD HH:MM:SS');
  const today = moment().format('YYYY-MM-DD HH:MM:SS');
  eventsEndpointParsed.searchParams.set('transaction_date_start', last30Days);
  eventsEndpointParsed.searchParams.set('transaction_date_end', today);

  const { rakutenConfig } = config.affiliateNetworks;

  const { data } = await axios.post(
    tokenEndpoint,
    qs.stringify({
      grant_type: 'password',
      username: rakutenConfig.accountUsername,
      password: rakutenConfig.accountPassword,
      scope: rakutenConfig.apiScope,
    }),
    {
      headers: {
        Authorization: `Basic ${rakutenConfig.webApiToken}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    },
  );

  const { data: eventsData } = await axios.get(eventsEndpointParsed.href, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  return eventsData;
};

export const createBulkRakutenTransactions = (
  data: RakutenTransactionsAttributes[],
  transaction: Transaction,
): Promise<RakutenTransactionsModel[]> => RakutenTransactions.bulkCreate(data, { transaction, ignoreDuplicates: true });

export const saveRakutenEventsToDatabase = async (transaction: Transaction): Promise<any> => {
  const actions = await getRakutenEvents();
  const cleanActions = actions.map((action: any) => dto.rakutenDTO.rakutenData(action));
  const users = await usersServices.findAllUsers(transaction);

  const modifiedActions = cleanActions.map((row: any) => {
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

  const createdActions = await createBulkRakutenTransactions(modifiedActions, transaction);
  return createdActions;
};
