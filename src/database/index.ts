import { Sequelize } from 'sequelize';
import config from '../config';
import { Database } from '../interfaces';
import { BrandsFactory } from './models/brands';
import { CommissionJunctionTransactionsFactory } from './models/commissionJunctionTransactions';
import { FinancialDashboardFactory } from './models/financialDashboard';
import { ImpactRadiusTransactionsFactory } from './models/impactRadiusEvents';
import { PaymentsFactory } from './models/payments';
import { RakutenTransactionsFactory } from './models/rakutenTransactions';
import { UserFactory } from './models/users';
import { UserTransactionsHistoryFactory } from './models/userTransactionsHistory';

export const dbConfig = new Sequelize(config.database.url, {
  define: { underscored: true, timestamps: true },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    acquire: 20000,
  },
});

export const Users = UserFactory(dbConfig);
export const FinancialDashboard = FinancialDashboardFactory(dbConfig);
export const RakutenTransactions = RakutenTransactionsFactory(dbConfig);
export const UserTransactionsHistory = UserTransactionsHistoryFactory(dbConfig);
export const ImpactRadiusTransactions = ImpactRadiusTransactionsFactory(dbConfig);
export const CommissionJunctionTransactions = CommissionJunctionTransactionsFactory(dbConfig);
export const Brands = BrandsFactory(dbConfig);
export const Payments = PaymentsFactory(dbConfig);

// relations
Users.hasOne(FinancialDashboard);
Users.hasMany(RakutenTransactions);
Users.hasMany(ImpactRadiusTransactions);
Users.hasMany(CommissionJunctionTransactions);
Users.hasMany(UserTransactionsHistory);
Users.hasMany(Payments);

const database: Database = {};

database.sequelize = dbConfig;
database.Sequelize = Sequelize;

export default database;
