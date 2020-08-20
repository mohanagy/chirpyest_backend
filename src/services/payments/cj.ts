/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, GraphQLClient } from 'graphql-request';
import config from '../../config';
import { constants, convertToCents, getHalfMonthRange } from '../../helpers';
import { IPaymentByUser } from '../../interfaces';

const { commissionJunctionBaseUrl } = constants;
const {
  affiliateNetworks: { commissionJunctionConfig },
} = config;

export const calculateCjUserPayment = async (): Promise<any> => {
  const { start, end, halfMonthId } = getHalfMonthRange();
  const startOfLastMonth = start.toJSON();
  const endOfLastMonth = end.toJSON();

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
    const userCommission: any = convertToCents(Number(amount) / 2);
    acc.push({ userId, amount: userCommission, type: 'CJ', status: 'pending', halfMonthId });
    return acc;
  }, []);

  return formatedTotalPayments;
};
