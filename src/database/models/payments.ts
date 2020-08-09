import { DataTypes, Sequelize } from 'sequelize';
import { PaymentsStatic } from '../../types/sequelize';

export function PaymentsFactory(sequelize: Sequelize): PaymentsStatic {
  return sequelize.define('Payments', {
    paypalAccount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    closedOut: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }) as PaymentsStatic;
}
