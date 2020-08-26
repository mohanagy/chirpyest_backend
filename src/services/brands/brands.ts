import { Transaction } from 'sequelize';
import { Brands } from '../../database';
import { BrandsAttributes } from '../../interfaces';
import { BrandsModel } from '../../types/sequelize';

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
export const createBrands = (data: Array<BrandsAttributes>, transaction: Transaction): Promise<Array<BrandsModel>> => {
  return Brands.bulkCreate(data, {
    updateOnDuplicate: ['brandName', 'commission', 'url', 'trackingLink', 'updatedAt', 'isExpired'],
    transaction,
  });
};
