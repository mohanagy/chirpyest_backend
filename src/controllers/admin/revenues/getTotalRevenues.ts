import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import moment from 'moment';
import { getImpactRadiusTotalRevnues, getCJTotalRevnues, getRakutenTotalRevnues } from '../../../services/admin';
import { httpResponse } from '../../../helpers';

export const getTotalRevenues = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  _transaction: Transaction,
): Promise<Response | void> => {
  const before30days = moment().subtract(30, 'days');
  const before30daysCopy = moment().subtract(30, 'days');
  const today = moment().subtract(1, 'days');
  const obj: any = {};
  let day = before30daysCopy;
  while (today >= day) {
    const formatedDate = day.format('YYYY-MM-DD');
    obj[formatedDate] = 0;
    day = before30daysCopy.add(1, 'd');
  }

  const impactRadiusData = await getImpactRadiusTotalRevnues(before30days, today);
  const rakutenData = await getRakutenTotalRevnues(before30days, today);
  const cjData = await getCJTotalRevnues(before30days, today);

  cjData.forEach((item: any) => {
    obj[item.date] += Number(item.revenues / 100);
  });
  impactRadiusData.forEach((item: any) => {
    obj[item.date] += Number(item.revenues);
  });
  rakutenData.forEach((item: any) => {
    obj[item.date] += Number(item.revenues);
  });

  const totalRevnuesByDay = Object.entries(obj).reduce((acc: any, [date, revenues]: any) => {
    acc.push({ date, revenues });
    return acc;
  }, []);
  return httpResponse.ok(response, totalRevnuesByDay);
};
