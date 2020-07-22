import axios from 'axios';
import { CronJob } from 'cron';
import moment from 'moment';
import config from '../config';
import { constants, logger } from '../helpers';

const { commissionJunctionCronJobPattern } = constants;
const {
  affiliateNetworks: { commissionJunctionConfig },
  server: { host },
} = config;
export const job = new CronJob(
  commissionJunctionCronJobPattern,
  async () => {
    try {
      const startDate = moment().subtract(1, 'month').toJSON();
      const endDate = moment().toJSON();
      const {
        data: {
          data: {
            publisherCommissions: { records },
          },
        },
      } = await axios.post(
        'https://commissions.api.cj.com/query',
        JSON.stringify({
          query: `{
                publisherCommissions(forPublishers: ["${commissionJunctionConfig.cJPublisherId}"], sincePostingDate: "${startDate}", beforePostingDate: "${endDate}") {
                  records {
                    actionTrackerId
                    actionTrackerName
                    advertiserName
                    postingDate
                    pubCommissionAmountUsd
                    shopperId
                    saleAmountUsd
                    correctionReason
                    orderDiscountUsd
                    aid
                    orderId
                    commissionId
                    saleAmountPubCurrency
                    orderDiscountPubCurrency
                    advertiserId
                  }              
                }
              }
              `,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${commissionJunctionConfig.cJPersonalKey}`,
          },
        },
      );
      if (records.length)
        await axios.post(`${host}/api/v1/affiliate-networks/commission-junction/webhook`, records, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-webhook-secret': commissionJunctionConfig.cJPersonalKey,
          },
        });
    } catch (error) {
      logger.error(
        `commission junction cron job error: ${error.response ? error.response.data.errors : error.message}`,
      );
    }
  },
  null,
  true,
  'Etc/UTC',
);
