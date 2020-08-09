import axios from 'axios';
import { CronJob } from 'cron';
import config from '../config';
import { constants, logger } from '../helpers';

const { preparingPaymentsCronJobPattern } = constants;

const {
  server: { host },
} = config;

export const preparePaymentsJob = new CronJob(
  preparingPaymentsCronJobPattern,
  async () => {
    try {
      await axios.get(`${host}/api/v1/payments`);
    } catch (error) {
      logger.error(`prepare payments cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
