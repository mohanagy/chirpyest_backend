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
      type: DataTypes.STRING,
      allowNull: false,
    },
    deltaPayout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intendedPayout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
    },
    deltaAmount: {
      type: DataTypes.STRING,
    },
    intendedAmount: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    originalCurrency: {
      type: DataTypes.STRING,
    },

    originalAmount: {
      type: DataTypes.STRING,
    },
    eventDate: {
      type: DataTypes.STRING,
    },
    creationDate: {
      type: DataTypes.STRING,
    },
    lockingDate: {
      type: DataTypes.STRING,
    },
    clearedDate: {
      type: DataTypes.STRING,
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
