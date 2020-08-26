import { CronJob } from 'cron';
import database from '../database';
import { constants, logger } from '../helpers';
import { paymentsService, paymentsTransitionsService } from '../services';

const { calculatePaymentsCronJobPattern } = constants;

export const calcPaymentsCronJob = new CronJob(
  calculatePaymentsCronJobPattern,
  async () => {
    logger.info('Calculate payment cronjob started');
    const transaction = await database.sequelize.transaction();
    try {
      const {
        calculateRakutenUserPayment,
        calculateImpactRadiusBothAccountsPayment,
        calculateCjUserPayment,
      } = paymentsService;
      const paymentsArr = await Promise.all([
        calculateRakutenUserPayment(),
        calculateImpactRadiusBothAccountsPayment(),
        calculateCjUserPayment(),
      ]);
      const flatPyaments = paymentsArr.flat();
      await paymentsTransitionsService.createPaymentsTransactions(flatPyaments, transaction);
      await transaction.commit();
      logger.info('Calculate payment cronjob succeeded');
    } catch (error) {
      await transaction.rollback();
      logger.error(`Calculate payment cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
