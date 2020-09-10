import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import moment from 'moment';
import { getImpactRadiusTotalRevnues, getCJTotalRevnues, getRakutenTotalRevnues } from '../../../services/admin';
import { httpResponse } from '../../../helpers';

export const getTotalRevenues = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const before30days = moment().subtract(30, 'days');
  const before30daysCopy = moment().subtract(30, 'days');
  const today = moment().subtract(1, 'days');
  const obj: any = {};
  let day = before30daysCopy;
  while (today >= day) {
    const formatedDate = day.format('YYYY-MM-DD');
    obj[formatedDate] = { impactRadius: 0, rakuten: 0, commissionJunction: 0, total: 0 };
    day = before30daysCopy.add(1, 'd');
  }

  const impactRadiusData = await getImpactRadiusTotalRevnues(before30days, today);
  const rakutenData = await getRakutenTotalRevnues(before30days, today);
  const cjData = await getCJTotalRevnues(before30days, today, transaction);

  cjData.forEach((item: any) => {
    obj[item.date].commissionJunction += Number(item.revenues / 100);
    obj[item.date].total += Number(item.revenues / 100);
  });
  impactRadiusData.forEach((item: any) => {
    obj[item.date].impactRadius += Number(item.revenues);
    obj[item.date].total += Number(item.revenues);
  });
  rakutenData.forEach((item: any) => {
    obj[item.date].rakuten += Number(item.revenues);
    obj[item.date].total += Number(item.revenues);
  });

  const totalRevnuesByDay = Object.entries(obj).reduce(
    (acc: any, [date, { rakuten, impactRadius, commissionJunction, total }]: any) => {
      acc.push({ date, rakuten, impactRadius, commissionJunction, total });
      return acc;
    },
    [],
  );

  await transaction.commit();
  return httpResponse.ok(response, totalRevnuesByDay);
};
