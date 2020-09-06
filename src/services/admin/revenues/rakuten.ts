import axios from 'axios';
import { Moment } from 'moment';
import camelcaseKeys from 'camelcase-keys';
import csv from 'csvtojson';
import { dto, constants } from '../../../helpers';

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
