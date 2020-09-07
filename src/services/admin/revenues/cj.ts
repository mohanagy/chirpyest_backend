import { Moment } from 'moment';
import { Op } from 'sequelize';
import database, { CommissionJunctionTransactions } from '../../../database';

export const getCJTotalRevnues = async (from: Moment, to: Moment): Promise<any> => {
  const startDate = new Date(from.format('YYYY-MM-DD'));
  const endDate = new Date(to.format('YYYY-MM-DD'));

  const allTransactions = await CommissionJunctionTransactions.findAll({
    where: {
      postingDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      [database.sequelize.literal(`DATE("posting_date")`), 'date'],
      [database.sequelize.fn('sum', database.sequelize.col('pub_commission_amount_usd')), 'revenues'],
    ],
    group: ['date'],
    raw: true,
  });

  return allTransactions;
};

export const getCJClosedRevnues = async (from: Moment, to: Moment): Promise<any> => {
  const startDate = new Date(from.format('YYYY-MM-DD'));
  const endDate = new Date(to.format('YYYY-MM-DD'));

  const closed = 'closed';

  const allTransactions = await CommissionJunctionTransactions.findAll({
    where: {
      actionStatus: closed,
      postingDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      [database.sequelize.literal(`DATE("posting_date")`), 'date'],
      [database.sequelize.fn('sum', database.sequelize.col('pub_commission_amount_usd')), 'revenues'],
    ],
    group: ['date'],
    raw: true,
  });

  return allTransactions;
};
