import { CronJob } from 'cron';
import database from '../database';
import { constants, logger } from '../helpers';
import { paymentsService, paymentsTransitionsService } from '../services';

const { calculatePaymentsCronJobPattern } = constants;

export const calcPaymentsCronJob = new CronJob(
  calculatePaymentsCronJobPattern,
  async () => {
    logger.info('CalculatePayment cronjob started');
    const transaction = await database.sequelize.transaction();
    const { calculateRakutenUserPayment, calculateImpactRadiusUserPayment, calculateCjUserPayment } = paymentsService;
    try {
      const dataaa = await Promise.all([
        calculateRakutenUserPayment(),
        calculateImpactRadiusUserPayment(),
        calculateCjUserPayment(),
      ]);
      console.log('data', dataaa);
      // save to the database
      await paymentsTransitionsService.createPaymentsTransactions(dataaa, transaction);
      transaction.commit();
      logger.info('CalculatePayment cronjob succeeded');
    } catch (error) {
      logger.error(`get brands cron job error: ${error.response ? error.response.data.errors : error.message}`);
      await transaction.rollback();
    }
  },
  null,
  true,
  'Etc/UTC',
);

// export const savePaymentsData = async () => {
//   console.log('hi');
//   try {
//     const transaction = await database.sequelize.transaction();

//     const promises = [
//       rakuten.calculateRakutenUserPayment(),
//       impactRadius.calculateImpactRadiusUserPayment(),
//       cj.calculateCjUserPayment(),
//     ];
//     // await rakuten.calculateRakutenUserPayment();
//     // await impactRadius.calculateImpactRadiusUserPayment();
//     // await cj.calculateCjUserPayment();
//     const res = await Promise.allSettled(promises);
//     // console.log('res', res);
//     res.forEach((item: any) => {
//       console.log(item.value);
//     });
//   } catch (error) {
//     console.log('error', error);
//   }
// };
