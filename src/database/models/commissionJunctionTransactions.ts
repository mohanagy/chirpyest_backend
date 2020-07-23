import { DataTypes, Sequelize } from 'sequelize';
import { CommissionJunctionStatic } from '../../types/sequelize';

export function CommissionJunctionTransactionsFactory(sequelize: Sequelize): CommissionJunctionStatic {
  return sequelize.define('commissionJunctionTransactions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actionTrackerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    advertiserId: {
      type: DataTypes.STRING,
    },
    actionTrackerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    advertiserName: {
      type: DataTypes.STRING,
    },
    pubCommissionAmountUsd: {
      type: DataTypes.INTEGER,
    },
    saleAmountUsd: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correctionReason: {
      type: DataTypes.STRING,
    },
    postingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    orderDiscountUsd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    commissionId: {
      type: DataTypes.STRING,
      unique: true,
    },
    saleAmountPubCurrency: {
      type: DataTypes.STRING,
    },
    orderDiscountPubCurrency: {
      type: DataTypes.STRING,
    },
  }) as CommissionJunctionStatic;
}
