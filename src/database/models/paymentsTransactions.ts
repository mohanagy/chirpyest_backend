import { DataTypes, Sequelize } from 'sequelize';
import { constants } from '../../helpers';
import { PaymentsTransactionsStatic } from '../../types/sequelize';

export function PaymentsTransactionsFactory(sequelize: Sequelize): PaymentsTransactionsStatic {
  return sequelize.define('PaymentsTransactions', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paypalAccount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: constants.PENDING,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }) as PaymentsTransactionsStatic;
}
