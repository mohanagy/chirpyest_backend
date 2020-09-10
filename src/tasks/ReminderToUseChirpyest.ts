import axios from 'axios';
import { CronJob } from 'cron';
import config from '../config';
import { constants, logger } from '../helpers';

const { sendReminderToUseChirpyestCronJobPattern } = constants;

const {
  server: { host },
} = config;

export const sendReminderToUseChirpyestJob = new CronJob(
  sendReminderToUseChirpyestCronJobPattern,
  async () => {
    try {
      await axios.get(`${host}/api/v1/users/reminder`);
    } catch (error) {
      logger.error(`sendReminder: cron job error: ${error.response ? error.response.data.errors : error.message}`);
    }
  },
  null,
  true,
  'Etc/UTC',
);
