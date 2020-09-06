import axios from 'axios';
import { Moment } from 'moment';
import camelcaseKeys from 'camelcase-keys';
import { dto, constants } from '../../../helpers';

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
