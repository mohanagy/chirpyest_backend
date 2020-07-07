import { DataTypes, Sequelize } from 'sequelize';
import { UserTransactionsHistoryStatic } from '../../types/sequelize';

export function UserTransactionsHistoryFactory(sequelize: Sequelize): UserTransactionsHistoryStatic {
  return sequelize.define('userTransactionsHistory', {
    userId: {
      type: DataTypes.INTEGER,
    },
    closedOut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    chirpyestCurrentBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usedPaypalAccount: {
      type: DataTypes.STRING,
    },
  }) as UserTransactionsHistoryStatic;
}
