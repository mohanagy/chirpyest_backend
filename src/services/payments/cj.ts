import { gql, GraphQLClient } from 'graphql-request';
import moment from 'moment';
import config from '../../config';
import { constants } from '../../helpers';
import { IPaymentByUser } from '../../interfaces';

const { commissionJunctionBaseUrl } = constants;
const {
  affiliateNetworks: { commissionJunctionConfig },
} = config;

const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toISOString();
const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toISOString();

export const calculateCjUserPayment = async (): Promise<any> => {
  const graphQLClient = new GraphQLClient(commissionJunctionBaseUrl, {
    headers: {
      authorization: `Bearer ${commissionJunctionConfig.cJPersonalKey}`,
    },
  });
  const query = gql`
    {
      publisherCommissions(forPublishers: ["${commissionJunctionConfig.cJPublisherId}"], sincePostingDate: "${startOfLastMonth}", beforePostingDate: "${endOfLastMonth}") {
        records {
          actionStatus
          actionType
          validationStatus
          original
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
          items {
            quantity
          }
        }
      }
    }
  `;

  const {
    publisherCommissions: { records: cjCommissionsListRaw },
  } = await graphQLClient.request(query);

  const closedPayments: any[] = [];
  cjCommissionsListRaw.forEach((record: any) => {
    const userId = record.shopperId;
    if (userId && !Number.isNaN(userId)) {
      if (record.actionStatus.toLowerCase() === 'closed') {
        closedPayments.push(record);
      }
    }
  });

  const paymentsByUser = closedPayments.reduce((acc: IPaymentByUser, curr) => {
    if (acc[curr.shopperId]) {
      acc[curr.shopperId] += Number(curr.pubCommissionAmountUsd);
    } else {
      acc[curr.shopperId] = Number(curr.pubCommissionAmountUsd);
    }
    return acc;
  }, {});

  const formatedTotalPayments = Object.entries(paymentsByUser).reduce((acc: any, curr) => {
    const [userId, amount] = curr;
    const userCommission: any = (amount / 2).toFixed(2);
    acc.push({ userId, amount: userCommission, type: 'CJ', status: 'pending' });
    return acc;
  }, []);

  console.log('formatedTotalPayments', formatedTotalPayments);

  // if (formatedTotalPayments.length) {
  //   // save to db
  // }

  return formatedTotalPayments;
};
