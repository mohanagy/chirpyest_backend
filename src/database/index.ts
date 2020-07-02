import { Sequelize } from 'sequelize';
import config from '../config';
import { FinancialDashboardFactory } from './models/financialDashboard';
import { RakutenTransactionsFactory } from './models/rakutenTransactions';
import { UserFactory } from './models/user';
import { UserTransactionsHistoryFactory } from './models/userTransactionsHistory';

export const dbConfig = new Sequelize(config.database.url);

// THIS ONES ARE THE ONES YOU NEED TO USE ON YOUR CONTROLLERS
export const User = UserFactory(dbConfig);
export const FinancialDashboard = FinancialDashboardFactory(dbConfig);
export const RakutenTransactions = RakutenTransactionsFactory(dbConfig);
export const UserTransactionsHistory = UserTransactionsHistoryFactory(dbConfig);

// relations
User.hasOne(FinancialDashboard);
User.hasMany(RakutenTransactions);
User.hasMany(UserTransactionsHistory);

const database: any = {};

database.sequelize = dbConfig;
database.Sequelize = Sequelize;

export default database;
