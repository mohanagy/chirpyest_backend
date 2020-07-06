import { dbConfig } from '../../database';

(async () => {
  await dbConfig.sync({ force: true });
})();
