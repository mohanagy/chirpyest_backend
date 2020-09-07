import { CronJob } from 'cron';
import database from '../database';
import { constants, logger } from '../helpers';
import { rakutenServices, impactRadiusServices } from '../services';

const { syncTransactionsCronJobPattern } = constants;

export const calcPaymentsCronJob = new CronJob(
  syncTransactionsCronJobPattern,
  async () => {
    logger.info('Sync transactions cron started');
    const transaction = await database.sequelize.transaction();
    try {
      await rakutenServices.saveRakutenEventsToDatabase(transaction);
      await impactRadiusServices.saveImpactRadiusActionsToDatabase(transaction);
      await transaction.commit();
      logger.info('Sync transactions cron succeeded');
    } catch (error) {
      await transaction.rollback();
      logger.error(`Sync transactions cron error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
