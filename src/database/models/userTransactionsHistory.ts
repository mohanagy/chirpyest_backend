import { DataTypes, Sequelize } from 'sequelize';
import { UserTransactionsHistoryStatic } from '../../types/sequelize';

export function UserTransactionsHistoryFactory(sequelize: Sequelize): UserTransactionsHistoryStatic {
  return sequelize.define('UserTransactionsHistory', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    closed_out: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paypal_account: {
      type: DataTypes.STRING,
    },
    chirpyest_current_balance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }) as UserTransactionsHistoryStatic;
}
