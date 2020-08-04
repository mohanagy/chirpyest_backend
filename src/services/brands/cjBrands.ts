import axiso from 'axios';
import camelCase from 'camelcase';
import { Parser } from 'xml2js';
import config from '../../config';
import { dto } from '../../helpers';
import { createBrands } from './brands';

const { commissionJunctionConfig } = config.affiliateNetworks;

const url = `https://advertiser-lookup.api.cj.com/v2/advertiser-lookup?requestor-cid=${commissionJunctionConfig.cJPublisherId}&advertiser-ids=joined`;

const token = commissionJunctionConfig.cJPersonalKey;

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
  await createBrands(cleanData);
  return cleanData;
};
