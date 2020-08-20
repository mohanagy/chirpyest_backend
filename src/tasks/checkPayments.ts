import axios from 'axios';
import { CronJob } from 'cron';
import config from '../config';
import { constants, logger } from '../helpers';

const { checkingPaymentsCronJobPattern } = constants;

const {
  server: { host },
} = config;

export const checkPaymentsJob = new CronJob(
  checkingPaymentsCronJobPattern,
  async () => {
    try {
      await axios.put(`${host}/api/v1/payments`);
    } catch (error) {
      logger.error(`send payments cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
