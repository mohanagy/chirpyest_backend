import dotenv from 'dotenv';
import path from 'path';
import { createFinancialDashboardRecords } from './financialDashboard';
import { createUsers } from './users';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.APP_ENV}`) });
}

const buildData = async (): Promise<void> => {
  await createUsers();
  return createFinancialDashboardRecords();
};

export default buildData;
