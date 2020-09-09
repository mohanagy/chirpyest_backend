import { DataTypes, Sequelize } from 'sequelize';
import { RakutenTransactionsStatic } from '../../types/sequelize';

export function RakutenTransactionsFactory(sequelize: Sequelize): RakutenTransactionsStatic {
  return sequelize.define('rakutenTransactions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    etransactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    advertiserId: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.STRING,
    },
    skuNumber: {
      type: DataTypes.STRING,
    },
    saleAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    commissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    processDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
    },
    productName: {
      type: DataTypes.STRING,
    },
    u1: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    isEvent: {
      type: DataTypes.STRING,
    },
  }) as RakutenTransactionsStatic;
}
