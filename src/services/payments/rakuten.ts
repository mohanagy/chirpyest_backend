/* eslint-disable no-restricted-syntax */
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import csv from 'csvtojson';
import { RakutenTransactions } from '../../database';
import { constants, convertToCents, getHalfMonthRange } from '../../helpers';
import { CommissionsByOrder, IPaymentByUser, OrdersGroupedByUser, RakutenFinalUserPayment } from '../../interfaces';

const { paymentSummaryEndpoint, paymentHistoryEndpoint, paymentDetailsReportEndpoint } = constants;
const paymentSummaryEndpointParsed = new URL(paymentSummaryEndpoint);
const { start, end, halfMonthId } = getHalfMonthRange();
const startOfLastMonth = start.format('YYYYMMDD');
const endOfLastMonth = end.format('YYYYMMDD');
paymentSummaryEndpointParsed.searchParams.set('bdate', startOfLastMonth);
paymentSummaryEndpointParsed.searchParams.set('edate', endOfLastMonth);

const timeout = (s: number) => new Promise((res) => setTimeout(res, s * 1000));

export const calculateRakutenUserPayment = async (): Promise<Array<RakutenFinalUserPayment>> => {
  const allTransactions = [];
  const { data: paymentsListCSV } = await axios.get(paymentSummaryEndpoint);
  const paymentsListRaw = await csv().fromString(paymentsListCSV);
  const paymentsList = camelcaseKeys(paymentsListRaw);

  for await (const payment of paymentsList) {
    const { data: csvString2 } = await axios.get(`${paymentHistoryEndpoint}&payid=${payment.paymentId}`);
    const advertiserPaymentHistoryRaw = await csv().fromString(csvString2);
    const advertiserPaymentHistory = camelcaseKeys(advertiserPaymentHistoryRaw);
    for await (const paymentDetails of advertiserPaymentHistory) {
      const { data: csvString3 } = await axios.get(
        `${paymentDetailsReportEndpoint}&invoiceid=${paymentDetails.invoiceNumber}`,
      );
      const paymentDetailsReportRaw = await csv().fromString(csvString3);
      const paymentDetailsReport = camelcaseKeys(paymentDetailsReportRaw);
      allTransactions.push(...paymentDetailsReport);
      // The payment api allow one request per minute + 15 sec to be safe
      await timeout(75);
    }
  }

  const commissionsByOrder = allTransactions.reduce((acc: CommissionsByOrder, transaction) => {
    if (acc[transaction.orderId]) {
      acc[transaction.orderId] += Number(transaction.actualCommission);
      return acc;
    }
    acc[transaction.orderId] = Number(transaction.actualCommission);
    return acc;
  }, {});

  const ordersIds = Object.keys(commissionsByOrder);
  const arr = await RakutenTransactions.findAll({
    where: {
      orderId: ordersIds,
    },
    raw: true,
  });

  let ordersGroupedByUser: OrdersGroupedByUser = {};
  if (arr.length) {
    ordersGroupedByUser = arr.reduce((acc: OrdersGroupedByUser, curr) => {
      if (!curr.userId) {
        return acc;
      }
      acc[curr.userId] = acc[curr.userId] || [];
      acc[curr.userId].push(curr.orderId);
      return acc;
    }, {});
  }

  const totalPaymentByUser: IPaymentByUser = {};
  Object.entries(ordersGroupedByUser).forEach((record) => {
    const [userId, orders] = record;
    orders.forEach((order: string) => {
      if (commissionsByOrder[order]) {
        if (totalPaymentByUser[userId]) {
          totalPaymentByUser[userId] += commissionsByOrder[order];
        } else {
          totalPaymentByUser[userId] = commissionsByOrder[order];
        }
      }
    });
  });

  const formatedTotalPayments: Array<RakutenFinalUserPayment> = Object.entries(totalPaymentByUser).reduce(
    (acc: Array<RakutenFinalUserPayment>, curr) => {
      const [userId, amount] = curr;
      const userPayment = convertToCents(Number(amount) / 2);
      acc.push({ userId, amount: userPayment, type: 'rakuten', halfMonthId });
      return acc;
    },
    [],
  );
  return formatedTotalPayments;
};
