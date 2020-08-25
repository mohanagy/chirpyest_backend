import { CronJob } from 'cron';
import moment from 'moment';
import { Op } from 'sequelize';
import { constants, logger } from '../helpers';
import { brandsService } from '../services';
import database, { Brands } from '../database';

const { brandsCronJobPattern } = constants;

export const getBrandsJob = new CronJob(
  brandsCronJobPattern,
  async () => {
    logger.info('Brands cron job started');
    const transaction = await database.sequelize.transaction();
    const { getRakutenBrands, getImpactRadiusBrands, getCjBrands } = brandsService;
    try {
      const brands = await Promise.all([getRakutenBrands(), getImpactRadiusBrands(), getCjBrands()]);
      const flatBrands = brands.flat();
      const resp = await brandsService.createBrands(flatBrands, transaction);
      const currentHour = moment(resp[0].updatedAt).startOf('hour').toJSON();
      // decide deleted brands
      await Brands.update(
        { isExpired: true },
        {
          where: {
            updatedAt: {
              [Op.lt]: currentHour,
            },
          },
          transaction,
        },
      );
      await transaction.commit();
      logger.info('Brands cron job succeeded');
    } catch (error) {
      await transaction.rollback();
      logger.error(`get brands cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
