/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';
import { DataTypes, Sequelize } from 'sequelize';

const basename = path.basename(__filename);
const sequelize = new Sequelize('postgres://abd:123@localhost:5432/chirpyest');

const db: any = {};

fs.readdirSync(path.join(__dirname, 'models'))
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, 'models', file)).default(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
