import { DataTypes, Sequelize } from 'sequelize';
import { ImpactRadiusTransactionsStatic } from '../../types/sequelize';

export function ImpactRadiusTransactionsFactory(sequelize: Sequelize): ImpactRadiusTransactionsStatic {
  return sequelize.define('impactRadiusTransactions', {
    userId: {
      type: DataTypes.INTEGER,
    },
    campaignName: {
      type: DataTypes.STRING,
    },
    actionTrackerId: {
      type: DataTypes.STRING,
    },
    actionId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    statusDetail: {
      type: DataTypes.STRING,
    },
    adId: {
      type: DataTypes.STRING,
    },
    payout: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deltaPayout: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    intendedPayout: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    deltaAmount: {
      type: DataTypes.INTEGER,
    },
    intendedAmount: {
      type: DataTypes.INTEGER,
    },
    currency: {
      type: DataTypes.STRING,
    },
    originalCurrency: {
      type: DataTypes.STRING,
    },

    originalAmount: {
      type: DataTypes.INTEGER,
    },
    eventDate: {
      type: DataTypes.DATE,
    },
    creationDate: {
      type: DataTypes.DATE,
    },
    lockingDate: {
      type: DataTypes.DATE,
    },
    clearedDate: {
      type: DataTypes.DATE,
    },
    referringDomain: {
      type: DataTypes.STRING,
    },
    landingPageUrl: {
      type: DataTypes.STRING,
    },
    subId1: {
      type: DataTypes.STRING,
    },
    subId2: {
      type: DataTypes.STRING,
    },
    subId3: {
      type: DataTypes.STRING,
    },
    promoCode: {
      type: DataTypes.STRING,
    },
  }) as ImpactRadiusTransactionsStatic;
}
