import { Brands } from '../../database';
import { BrandsAttributes } from '../../interfaces';
import { BrandsModel } from '../../types/sequelize';

export const getBrands = (): Promise<BrandsModel[]> => {
  return Brands.findAll();
};

export const createBrands = (data: BrandsAttributes[]): Promise<BrandsModel[]> => {
  return Brands.bulkCreate(data, {
    ignoreDuplicates: true,
  });
};
