import { DataTypes, Sequelize } from 'sequelize';
import { constants } from '../../helpers';
import { PaymentsTransactionsStatic } from '../../types/sequelize';

export function PaymentsTransactionsFactory(sequelize: Sequelize): PaymentsTransactionsStatic {
  return sequelize.define(
    'PaymentsTransactions',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paypalAccount: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: constants.PENDING,
      },
      halfMonthId: {
        type: DataTypes.STRING, // 1_8_2020 => firstHalf_month_year
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'type', 'half_month_id'],
          where: {},
        },
      ],
    },
  ) as PaymentsTransactionsStatic;
}
