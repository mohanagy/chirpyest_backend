import { DataTypes, Sequelize } from 'sequelize';
import { BrandsStatic } from '../../types/sequelize';

export function BrandsFactory(sequelize: Sequelize): BrandsStatic {
  return sequelize.define('brands', {
    brandId: {
      type: DataTypes.STRING,
      unique: true,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackingLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }) as BrandsStatic;
}
