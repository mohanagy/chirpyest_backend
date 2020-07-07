import { dbConfig } from '.';
import buildData from './testData';

const buildDb = async (): Promise<any> => {
  await dbConfig.sync({ force: true });
  return buildData();
};

export default buildDb;
