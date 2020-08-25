import { CronJob } from 'cron';
import moment from 'moment';
import { Op } from 'sequelize';
import { constants, logger } from '../helpers';
import { brandsService } from '../services';
import database, { Brands } from '../database';

const {
  brandsCronJobPattern,
  campaignsEndpoint,
  campaignsEndpoint2,
  ir2CampaignsEndpoint,
  ir2CampaignsEndpoint2,
} = constants;

export const getBrandsJob = new CronJob(
  brandsCronJobPattern,
  async () => {
    logger.info('Brands cron job started');
    const transaction = await database.sequelize.transaction();
    const { getRakutenBrands, getImpactRadiusBrands, getCjBrands } = brandsService;
    const impactRadiusAccount1Promies = getImpactRadiusBrands(campaignsEndpoint, campaignsEndpoint2);
    const impactRadiusAccount2Promies = getImpactRadiusBrands(ir2CampaignsEndpoint, ir2CampaignsEndpoint2);
    try {
      const brands = await Promise.all([
        getRakutenBrands(),
        impactRadiusAccount1Promies,
        impactRadiusAccount2Promies,
        getCjBrands(),
      ]);
      const flatBrands = brands.flat();
      // filter duplicates
      const cache: any = {};
      flatBrands.forEach((brand) => {
        if (!cache[brand.brandId]) {
          cache[brand.brandId] = brand;
        }
      });
      const resp = await brandsService.createBrands(Object.values(cache), transaction);
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
