import { DataTypes, Sequelize } from 'sequelize';
import { RakutenTransactionsStatic } from '../../types/sequelize';

export function RakutenTransactionsFactory(sequelize: Sequelize): RakutenTransactionsStatic {
  return sequelize.define('rakutenTransactions', {
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
      type: DataTypes.INTEGER,
    },
    adId: {
      type: DataTypes.INTEGER,
    },
    payout: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deltaPayout: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    intendedPayout: {
      type: DataTypes.DATE,
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
  }) as RakutenTransactionsStatic;
}
