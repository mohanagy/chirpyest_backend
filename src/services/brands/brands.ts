import { Op } from 'sequelize';
import axios from 'axios';
import { constants, dto } from '../../helpers';
import { Brands } from '../../database';
import { BrandsAttributes, GenerateTrackableLinkAttributes, UrlBrand } from '../../interfaces';
import { BrandsModel } from '../../types/sequelize';
import config from '../../config';

/**
 * @description getBrands is a service used to get a list of all the brands
 * @return {Promise<Array<BrandsModel>>}
 */
export const getBrands = (filter: any): Promise<Array<BrandsModel>> => {
  return Brands.findAll(filter);
};

/**
 * @description createBrands is a service used to insert a list of the brands to the database
 * @return {Promise<Array<BrandsModel>>}
 */
export const createBrands = (data: Array<BrandsAttributes>): Promise<Array<BrandsModel>> => {
  return Brands.bulkCreate(data, {
    updateOnDuplicate: ['brandName', 'category', 'updatedAt'],
  });
};

/**
 * @description Add parameters to open new url for rakuten
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} activeTabUrl
 * @returns string
 */
export const generateRakutenUrl = ({ trackingLink, brandId, userId = '', activeTabUrl }: UrlBrand): string => {
  const trackingUrl = `${trackingLink}&mid=${brandId}&u1=${userId}&murl=${activeTabUrl}`;
  return trackingUrl;
};

/**
 * @description Add parameters to generate new url for impact radius
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} activeTabUrl
 * @returns string
 */
export const generateImpactRadiusUrl = ({ trackingLink, userId = '', activeTabUrl }: UrlBrand): string => {
  const trackingUrl = `${trackingLink}?subId1=${userId}&u=${activeTabUrl}`;
  return trackingUrl;
};

/**
 * @description Add parameters to generate new url for commission junction
 * @param  {string} trackingLink
 * @param  {string} userId
 * @param  {string} activeTabUrl
 * @returns string
 */
export const generateCommissionJunctionUrl = ({ trackingLink, userId, activeTabUrl }: UrlBrand): string => {
  let trackingUrl = trackingLink?.replace('defaultvalue', userId || 'defaultvalue');
  trackingUrl = `${trackingUrl}/${activeTabUrl}`;
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
export const checkUrlNetwork = async (url: string, userId: string): Promise<string> => {
  const filter = dto.generalDTO.filterData({
    isDeleted: { [Op.not]: true },
  });
  const brands = await getBrands(filter);
  const brand = brands.find(({ url: urlBrand }) =>
    url.includes(
      urlBrand.toLowerCase().replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0],
    ),
  );
  if (!brand) throw new Error(constants.messages.brands.linkNotRelatedToOurNetwork);
  const { network, trackingLink, brandId } = brand;
  const data: UrlBrand = {
    trackingLink,
    brandId,
    userId,
    activeTabUrl: url,
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
