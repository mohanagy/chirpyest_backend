import axiso from 'axios';
import camelCase from 'camelcase';
import { Parser } from 'xml2js';
import config from '../../config';
import { constants, dto } from '../../helpers';
import { createBrands } from './brands';

const {
  commissionJunctionConfig: { cJPersonalKey },
} = config.affiliateNetworks;
const { commissionJunctionBrandsUrl } = constants;

export const getCjBrands = async (): Promise<any> => {
  const { data } = await axiso.get(commissionJunctionBrandsUrl, {
    headers: {
      Authorization: `Bearer ${cJPersonalKey}`,
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
