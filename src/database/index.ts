import { Sequelize } from 'sequelize';
import config from '../config';
import { Database } from '../interfaces';
import { UserFactory } from './models/users';

export const dbConfig = new Sequelize(config.database.url, {
  define: { underscored: true, timestamps: true },
  logging: false,
});

export const Users = UserFactory(dbConfig);

const database: Database = {};

database.sequelize = dbConfig;
database.Sequelize = Sequelize;

export default database;
