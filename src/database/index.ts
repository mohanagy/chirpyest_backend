import { Sequelize } from 'sequelize';
import config from '../config';
import { Database } from '../interfaces';
import { UserFactory } from './models/users';

export const dbConfig = new Sequelize(config.database.url);

// THIS ONES ARE THE ONES YOU NEED TO USE ON YOUR Services
export const Users = UserFactory(dbConfig);

const database: Database = {};

database.sequelize = dbConfig;
database.Sequelize = Sequelize;

export default database;
