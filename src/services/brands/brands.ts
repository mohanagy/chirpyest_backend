import { Op, Transaction } from 'sequelize';
import axios from 'axios';
import psl from 'psl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import parseUrl from 'parse-url';
import { dto } from '../../helpers';
import database, { Brands } from '../../database';
import { BrandsAttributes, GenerateTrackableLinkAttributes, UrlBrand } from '../../interfaces';
import { BrandsModel } from '../../types/sequelize';
import config from '../../config';
import { commissionJunctionServices, impactRadiusServices, rakutenServices } from '../affiliateNetworks';

/**
 * @description getBrands is a service used to get a list of all the brands
 * @return {Promise<Array<BrandsModel>>}
 */
export const getBrands = (filter: any, transaction: Transaction): Promise<Array<BrandsModel>> => {
  return Brands.findAll({ ...filter, transaction, raw: true });
};

/**
 * @description createBrands is a service used to insert a list of the brands to the database
 * @return {Promise<Array<BrandsModel>>}
 */
export const createBrands = (data: Array<BrandsAttributes>, transaction: Transaction): Promise<Array<BrandsModel>> => {
  return Brands.bulkCreate(data, {
    updateOnDuplicate: ['brandName', 'commission', 'url', 'trackingLink', 'updatedAt', 'isExpired'],
    transaction,
  });
};

/**
 * @description Add parameters to open new url for rakuten
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} originalUrl
 * @returns string
 */
export const generateRakutenUrl = ({ trackingLink, brandId, userId = '', originalUrl }: UrlBrand): string => {
  const trackingUrl = `${trackingLink}&mid=${brandId}&u1=${userId}&murl=${originalUrl}`;
  return trackingUrl;
};

/**
 * @description Add parameters to generate new url for impact radius
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} originalUrl
 * @returns string
 */
export const generateImpactRadiusUrl = ({ trackingLink, userId = '', originalUrl }: UrlBrand): string => {
  const trackingUrl = `${trackingLink}?subId1=${userId}&u=${originalUrl}`;
  return trackingUrl;
};

/**
 * @description Add parameters to generate new url for commission junction
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} originalUrl
 * @returns string
 */
export const generateCommissionJunctionUrl = ({ trackingLink, userId, originalUrl }: UrlBrand): string => {
  let trackingUrl = trackingLink?.replace('defaultvalue', userId || 'defaultvalue');
  trackingUrl = `${trackingUrl}/${originalUrl}`;
  return trackingUrl;
};

export const generateTrackableLink: GenerateTrackableLinkAttributes = {
  commissionJunction: generateCommissionJunctionUrl,
  rakuten: generateRakutenUrl,
  impactRadius: generateImpactRadiusUrl,
};
/**
 * @description checkUrlNetwork is a function used to check if the provided link is one of our brands or not
 * @param  {string} url
 * @param  {string} userId
 * @returns Promise
 */
export const checkUrlNetwork = async (
  url: string,
  userId: string,
  transaction: Transaction,
): Promise<string | undefined> => {
  const filter = dto.generalDTO.filterData({
    isDeleted: { [Op.not]: true },
  });
  const brands = await getBrands(filter, transaction);
  const urlWithoutProtocol = parseUrl(url).resource.replace(/^https?:\/\//, '');
  const domain: string = psl.get(urlWithoutProtocol) || '';
  if (!domain) return undefined;
  const brand = brands.find(({ url: urlBrand }) => urlBrand.toLocaleLowerCase().includes(domain.toLocaleLowerCase()));

  if (!brand) return undefined;
  const { network, trackingLink, brandId } = brand;
  const data: UrlBrand = {
    trackingLink,
    brandId,
    userId,
    originalUrl: url,
  };
  const trackableLink: string = generateTrackableLink[network](data);
  return trackableLink;
};
/**
 * @description convertLink is a function used for generating short link using rebrandly service
 * @param  {string} url
 * @returns Promise
 */
export const convertLink = async (url: string): Promise<any> => {
  const { brandsConfig } = config;

  const linkRequest = {
    destination: url,
    domain: { fullName: brandsConfig.rebrandlyDomain },
  };

  const requestHeaders = {
    'Content-Type': 'application/json',
    apikey: brandsConfig.rebrandlyApiKey,
    workspace: brandsConfig.rebrandlyWorkspace,
  };
  const { data } = await axios.post(brandsConfig.rebrandlyEndpoint, JSON.stringify(linkRequest), {
    headers: requestHeaders,
  });
  return data;
};
/**
 * @description classifyBrands is a function used to classify the brands depends on network
 * @param  {Array<BrandsModel>} brands all brands
 * @returns {Object} Object contains three types of networks
 */
export const classifyBrands = (brands: Array<BrandsModel>): Record<string, any> =>
  brands.reduce(
    (acc: any, brand: BrandsModel) => {
      const { network, brandId } = brand;
      if (acc[network]) acc[network].push(brandId);
      return acc;
    },
    {
      impactRadius: [],
      commissionJunction: [],
      rakuten: [],
    },
  );

/**
 * @description getBrandsTransaction  this function will fetch all transaction for each brand
 * @param param0
 * @param {Transaction} transaction Transaction
 * @returns {Array} list of transactions
 */
export const getBrandsTransaction = async (
  { commissionJunction, impactRadius, rakuten }: any,
  transaction: Transaction,
): Promise<Array<any>> => {
  const commissionJunctionTransactions = await commissionJunctionServices.findAllCommissionJunctionTransactions(
    {
      where: {
        advertiserId: {
          [Op.in]: commissionJunction,
        },
      },
      attributes: [
        ['advertiser_id', 'brandId'],
        [database.sequelize.fn('sum', database.sequelize.col('pub_commission_amount_usd')), 'total'],
      ],
      group: ['advertiser_id'],
    },
    transaction,
  );

  const impactRadiusTransactions = await impactRadiusServices.findAllImpactRadiusTransactions(
    {
      where: {
        campaignId: {
          [Op.in]: impactRadius,
        },
      },
      attributes: [
        ['campaign_id', 'brandId'],
        [database.sequelize.fn('sum', database.sequelize.col('amount')), 'total'],
      ],
      group: ['campaign_id'],
    },
    transaction,
  );
  const rakutenTransactions = await rakutenServices.findAllRakutenTransactions(
    {
      where: {
        advertiserId: {
          [Op.in]: rakuten,
        },
      },
      attributes: [
        ['advertiser_id', 'brandId'],
        [database.sequelize.fn('sum', database.sequelize.col('commissions')), 'total'],
      ],
      group: ['advertiser_id'],
    },
    transaction,
  );
  return [...commissionJunctionTransactions, ...impactRadiusTransactions, ...rakutenTransactions];
};
