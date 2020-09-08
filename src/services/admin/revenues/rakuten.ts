import axios from 'axios';
import { Moment } from 'moment';
import camelcaseKeys from 'camelcase-keys';
import csv from 'csvtojson';
import { Op, Transaction } from 'sequelize';
import { dto, constants } from '../../../helpers';
import database, { RakutenTransactions } from '../../../database';

const { rakutenByDayReport } = constants;

export const getRakutenTotalRevnues = async (from: Moment, to: Moment): Promise<any> => {
  const updatedUrl = new URL(rakutenByDayReport);
  updatedUrl.searchParams.set('start_date', from.format('YYYY-MM-DD'));
  updatedUrl.searchParams.set('end_date', to.format('YYYY-MM-DD'));

  const { data: revnuesListCSV } = await axios.get(updatedUrl.href);
  const revnuesListRaw = await csv().fromString(revnuesListCSV);
  const revnues = camelcaseKeys(revnuesListRaw);
  const cleanData = revnues.map((item) => dto.rakutenDTO.rakutenTotalRevenuesData(item));

  return cleanData;
};

export const getRakutenClosedRevenues = async (from: Moment, to: Moment, transaction: Transaction): Promise<any> => {
  const startDate = new Date(from.format('YYYY-MM-DD'));
  const endDate = new Date(to.format('YYYY-MM-DD'));

  const allTransactions = await RakutenTransactions.findAll({
    where: {
      transactionDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      [database.sequelize.literal(`DATE("transaction_date")`), 'date'],
      [database.sequelize.fn('sum', database.sequelize.col('commissions')), 'revenues'],
    ],
    group: ['date'],
    raw: true,
    transaction,
  });

  return allTransactions;
};
