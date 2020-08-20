import { Brands } from '../../database';
import { BrandsAttributes } from '../../interfaces';
import { BrandsModel } from '../../types/sequelize';

/**
 * @description getBrands is a service used to get a list of all the brands
 * @return {Promise<Array<BrandsModel>>}
 */
export const getBrands = (): Promise<Array<BrandsModel>> => {
  return Brands.findAll();
};

/**
 * @description createBrands is a service used to insert a list of the brands to the database
 * @return {Promise<Array<BrandsModel>>}
 */
export const createBrands = (data: Array<BrandsAttributes>): Promise<Array<BrandsModel>> => {
  return Brands.bulkCreate(data, {
    ignoreDuplicates: true,
  });
};