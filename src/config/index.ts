import dotenv from 'dotenv';
import path from 'path';
import cognito from './cognito';
import database from './database';
import server from './server';

if (!process.env.NODE_ENV) {
  throw new Error('You have to set NODE_ENV');
}

// load the right .env.APP_ENV in local development
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.APP_ENV}`) });
}

export default {
  database: database(),
  server: server(),
  cognito: cognito(),
};
