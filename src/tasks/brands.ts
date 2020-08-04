import { CronJob } from 'cron';
import { constants, logger } from '../helpers';
import { brandsService } from '../services';

const { brandsCronJobPattern } = constants;

export const getBrandsJob = new CronJob(
  brandsCronJobPattern,
  async () => {
    const { getRakutenBrands, getImpactRadiusBrands, getCjBrands } = brandsService;
    try {
      await Promise.all([getRakutenBrands(), getImpactRadiusBrands(), getCjBrands()]);
    } catch (error) {
      logger.error(`get brands cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
