const dotenv = require('dotenv');
const path = require('path');
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

if (!process.env.NODE_ENV) {
  throw new Error('You have to set NODE_ENV');
}

// load the right .env.APP_ENV in local development
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.APP_ENV}`) });
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: { underscored: true, timestamps: true },
  logging: false,
});

const umzug = new Umzug({
  migrations: {
    path: './migrations',
    params: [sequelize.getQueryInterface()],
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
});

(async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  await umzug.up();
})();
