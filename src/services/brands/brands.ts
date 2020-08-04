import { Brands } from '../../database';
import { BrandsModel } from '../../types/sequelize';

export const getBrands = async (): Promise<BrandsModel[]> => {
  return Brands.findAll();
};

export const createBrands = (data) => {
  return Brands.bulkCreate(data, {
    ignoreDuplicates: true,
  });
};
