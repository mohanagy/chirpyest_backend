import { Sequelize } from 'sequelize';
import { models } from './models';

const sequelize = new Sequelize('postgres://abd:123@localhost:5432/chirpyest');

export { sequelize, models };
