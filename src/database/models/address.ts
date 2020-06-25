import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

class Address extends Model {
  public userId!: number;

  public address!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Address.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    address: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'address',
    sequelize, // passing the `sequelize` instance is required
  },
);

export default Address;
