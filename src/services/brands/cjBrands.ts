import axiso from 'axios';
import camelCase from 'camelcase';
import dotenv from 'dotenv';
import { Parser } from 'xml2js';
import { dto } from '../../helpers';

dotenv.config();

const url = 'https://advertiser-lookup.api.cj.com/v2/advertiser-lookup?requestor-cid=4014745&advertiser-ids=joined';

const token = '2x3hzy66wnys7h5yc52cj6ngrn';

export const getCjBrands = async (): Promise<any> => {
  const { data } = await axiso.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const parser = new Parser({
    tagNameProcessors: [camelCase],
    attrNameProcessors: [camelCase],
    explicitArray: false,
  });

  const result = await parser.parseStringPromise(data);

  const cleanData = result.cjApi.advertisers.advertiser.map((item: any) => {
    return dto.commissionJunctionDTO.commissionJunctionBrands(item);
  });

  // save to the db
  return cleanData;
};
