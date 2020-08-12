import axios from 'axios';
import qs from 'qs';
import { Transaction } from 'sequelize';
import config from '../config';
import * as database from '../database';
import { constants } from '../helpers';
import { Filter, PaymentsAttributes, PayoutsRequestAttributes } from '../interfaces';
import { PaymentsModel } from '../types/sequelize';

const { Payments } = database;
const { payPalConfig } = config;

/**
 * @description createBulkPayments is a service used to create list of payments records
 * @param {Array<PaymentsAttributes>} data list of payments records
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes>} User data
 */
export const createBulkPayments = (
  data: Array<PaymentsAttributes>,
  transaction?: Transaction,
): Promise<PaymentsAttributes[]> => {
  return Payments.bulkCreate(data, { transaction, updateOnDuplicate: ['updatedAt'] });
};

/**
 * @description updatePayments is a service used to update payments records
 * @param {Array<PaymentsAttributes>} data list of payments records
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes>} User data
 */
export const updatePayments = (
  filter: Filter,
  data: Partial<PaymentsAttributes>,
  transaction?: Transaction,
): Promise<[number, PaymentsModel[]]> => {
  return Payments.update(data, { transaction, ...filter });
};

/**
 * @description getAllPayments is a service used to find all payments depends on filter
 * @param {Filter} filter filters applied on search
 * @param {Transaction} transaction  transaction object
 * @return {Promise<PaymentsAttributes>} User data
 */
export const getAllPayments = (filter: Filter, transaction?: Transaction): Promise<PaymentsAttributes[]> => {
  return Payments.findAll({ ...filter, transaction, raw: true });
};

/**
 * @description generatePayPalAccessToken is a service used to generate payPal access tokens
 * @return {Promise<string>} access token
 */
export const generatePayPalAccessToken = async (): Promise<string> => {
  const { data } = await axios.post(
    `${constants.payPalEndpoint}/v1/oauth2/token`,
    qs.stringify({
      grant_type: 'client_credentials',
    }),
    {
      auth: {
        username: payPalConfig.payPalClientId,
        password: payPalConfig.payPalSecret,
      },
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return data.access_token;
};

/**
 * @description sendPayPalPayouts is a service used for sending payouts to users
 * @param  {PayoutsRequestAttributes} PayoutsRequestData
 * @returns {Promise<any>}
 */
export const sendPayPalPayouts = async (PayoutsRequestData: PayoutsRequestAttributes): Promise<any> => {
  const authorizationToken = await generatePayPalAccessToken();
  const { data } = await axios.post(`${constants.payPalEndpoint}/v1/payments/payouts`, PayoutsRequestData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationToken}`,
    },
  });

  return data;
};

/**
 * @description showPayoutBatchDetails is a service used for display the status of the payout
 * @param  {string} patchBatchId patch Batch Id
 * @returns {Promise<any>}
 */
export const showPayoutBatchDetails = async (patchBatchId: string): Promise<any> => {
  const authorizationToken = await generatePayPalAccessToken();
  const { data } = await axios.get(`${constants.payPalEndpoint}/v1/payments/payouts/${patchBatchId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationToken}`,
    },
  });

  return data;
};
