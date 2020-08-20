import { CronJob } from 'cron';
import { constants, logger } from '../helpers';
import { brandsService } from '../services';

const { brandsCronJobPattern } = constants;

export const getBrandsJob = new CronJob(
  brandsCronJobPattern,
  async () => {
    logger.info('Brands cron job started');
    const { getRakutenBrands, getImpactRadiusBrands, getCjBrands } = brandsService;
    try {
      await Promise.all([getRakutenBrands(), getImpactRadiusBrands(), getCjBrands()]);
      logger.info('Brands cron job succeeded');
    } catch (error) {
      logger.error(`get brands cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
