import axios from 'axios';
import { Moment } from 'moment';
import camelcaseKeys from 'camelcase-keys';
import { Op, Transaction } from 'sequelize';
import { dto, constants } from '../../../helpers';
import database, { ImpactRadiusTransactions } from '../../../database';

const { dailyReportsEndPoint1, dailyReportsEndPoint2 } = constants;

const getImpactAccountsData = async (url: string, from: Moment, to: Moment) => {
  const updatedUrl = new URL(url);
  updatedUrl.searchParams.set('START_DATE', from.format('YYYY-MM-DD'));
  updatedUrl.searchParams.set('END_DATE', to.format('YYYY-MM-DD'));
  const { data } = await axios.get(updatedUrl.href);
  const cleanData = data.Records.map((item: any) => {
    const camelcase = camelcaseKeys(item);
    const dtoClean = dto.impactRadiusDTO.impactRaduisDailyRevenues(camelcase);
    return dtoClean;
  });
  return cleanData;
};

export const getImpactRadiusTotalRevnues = async (from: Moment, to: Moment): Promise<any> => {
  const firstAccountRevnues = await getImpactAccountsData(dailyReportsEndPoint1, from, to);
  const secondAccountRevnues = await getImpactAccountsData(dailyReportsEndPoint2, from, to);
  const allImpactRadius = firstAccountRevnues.concat(secondAccountRevnues);
  const obj: any = {};

  allImpactRadius.forEach((item: any) => {
    if (!obj[item.date]) {
      obj[item.date] = Number(item.revenues);
    } else {
      obj[item.date] += Number(item.revenues);
    }
  });

  const totalImpactBothAccountsRevnuesByDay = Object.entries(obj).reduce((acc: any, [date, revenues]) => {
    acc.push({ date, revenues });
    return acc;
  }, []);

  return totalImpactBothAccountsRevnuesByDay;
};

export const getImpactClosedRevenues = async (from: Moment, to: Moment, transaction: Transaction): Promise<any> => {
  const startDate = new Date(from.format('YYYY-MM-DD'));
  const endDate = new Date(to.format('YYYY-MM-DD'));

  const allTransactions = await ImpactRadiusTransactions.findAll({
    where: {
      eventDate: {
        [Op.between]: [startDate, endDate],
      },
      status: 'approved',
      statusDetail: 'paid',
    },
    attributes: [
      [database.sequelize.literal(`DATE("event_date")`), 'date'],
      [database.sequelize.fn('sum', database.sequelize.col('payout')), 'revenues'],
    ],
    group: ['date'],
    raw: true,
    transaction,
  });

  return allTransactions;
};
