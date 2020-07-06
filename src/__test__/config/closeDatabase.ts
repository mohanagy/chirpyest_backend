import { dbConfig } from '../../database';

(async () => {
  await dbConfig.close();
})();
