import { DataTypes, Sequelize } from 'sequelize';
import { CommissionJunctionStatic } from '../../types/sequelize';

export function CommissionJunctionTransactionsFactory(sequelize: Sequelize): CommissionJunctionStatic {
  return sequelize.define('commissionJunctionTransactions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actionStatus: {
      type: DataTypes.STRING,
    },
    eventDate: {
      type: DataTypes.DATE,
    },
    lockingDate: {
      type: DataTypes.DATE,
    },
    validationStatus: {
      type: DataTypes.STRING,
    },
    reviewedStatus: {
      type: DataTypes.STRING,
    },
    actionType: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    websiteId: {
      type: DataTypes.STRING,
    },
    shopperId: {
      type: DataTypes.STRING,
    },
    websiteName: {
      type: DataTypes.STRING,
    },
    lockingMethod: {
      type: DataTypes.STRING,
    },
    original: {
      type: DataTypes.BOOLEAN,
    },
    originalActionId: {
      type: DataTypes.STRING,
    },
    siteToStoreOffer: {
      type: DataTypes.STRING,
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
