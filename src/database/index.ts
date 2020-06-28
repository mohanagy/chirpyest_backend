import { Sequelize } from 'sequelize';
import config from '../config';
import { UserFactory } from './models/user';

export const dbConfig = new Sequelize(config.database.url);

// THIS ONES ARE THE ONES YOU NEED TO USE ON YOUR CONTROLLERS
export const User = UserFactory(dbConfig);
