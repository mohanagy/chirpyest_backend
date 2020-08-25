/* eslint-disable no-await-in-loop */
import axios from 'axios';
import camelCase from 'camelcase';
import { Parser } from 'xml2js';
import config from '../../config';
import { constants, dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';

const {
  commissionJunctionConfig: { cJPersonalKey },
} = config.affiliateNetworks;
const { commissionJunctionBrandsUrl } = constants;

export const getCjBrands = async (): Promise<Array<BrandsAttributes>> => {
  let page = 1;
  let totalRecords = 0;
  let allAdvertisers: Array<BrandsAttributes> = [];
  let result = [];

  do {
    const { data } = await axios.get(commissionJunctionBrandsUrl, {
      params: { 'page-number': page },
      headers: {
        Authorization: `Bearer ${cJPersonalKey}`,
      },
    });

    page += 1;
    const parser = new Parser({
      tagNameProcessors: [camelCase],
      attrNameProcessors: [camelCase],
      explicitArray: false,
    });

    result = await parser.parseStringPromise(data);

    totalRecords = result.cjApi.advertisers.$.totalMatched;
    const cleanData: Array<BrandsAttributes> = result.cjApi.advertisers.advertiser.map((item: any) => {
      return dto.commissionJunctionDTO.commissionJunctionBrands(item);
    });
    allAdvertisers = allAdvertisers.concat(cleanData);
  } while (allAdvertisers.length < totalRecords);
  return allAdvertisers;
};
