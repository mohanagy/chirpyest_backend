import { DataTypes, Sequelize } from 'sequelize';
import { FinancialDashboardStatic } from '../../types/sequelize';

export function FinancialDashboardFactory(sequelize: Sequelize): FinancialDashboardStatic {
  return sequelize.define('FinancialDashboard', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    pending: {
      type: DataTypes.FLOAT,
    },
    receivable_milestone: {
      type: DataTypes.FLOAT,
    },
    earnings: {
      type: DataTypes.FLOAT,
    },
    last_closed_out: {
      type: DataTypes.FLOAT,
    },
  }) as FinancialDashboardStatic;
}
