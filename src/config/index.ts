import dotenv from 'dotenv';
import database from './database';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// load .env in local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

try {
  database();
} catch (error) {
  throw new Error(`Error in config validation: ${error.message}`);
}

export default {
  database: database(),
};
