import { DataTypes, Sequelize } from 'sequelize';
import { FinancialDashboardStatic } from '../../types/sequelize';

export function FinancialDashboardFactory(sequelize: Sequelize): FinancialDashboardStatic {
  return sequelize.define('financialDashboard', {
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    pending: {
      type: DataTypes.INTEGER,
    },
    receivableMilestone: {
      type: DataTypes.INTEGER,
    },
    earnings: {
      type: DataTypes.INTEGER,
    },
    lastClosedOut: {
      type: DataTypes.INTEGER,
    },
  }) as FinancialDashboardStatic;
}
