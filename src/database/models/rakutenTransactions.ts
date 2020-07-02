import { DataTypes, Sequelize } from 'sequelize';
import { RakutenTransactionsStatic } from '../../types/sequelize';

export function RakutenTransactionsFactory(sequelize: Sequelize): RakutenTransactionsStatic {
  return sequelize.define('RakutenTransactions', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    advertiser_id: {
      type: DataTypes.STRING,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offer_id: {
      type: DataTypes.STRING,
    },
    sku_number: {
      type: DataTypes.STRING,
    },
    sale_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    commissions: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    process_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.STRING,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    u1: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    is_event: {
      type: DataTypes.STRING,
    },
  }) as RakutenTransactionsStatic;
}
