import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import moment from 'moment';
import { URL } from 'url';
import { constants, dto } from '../../helpers';
import { ImpactRadiusPayment, IPaymentByUser } from '../../interfaces';

const { paymentReportEndpoint } = constants;

const paymentReportEndpointParsed = new URL(paymentReportEndpoint);
const startOfLastMonth = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
const endOfLastMonth = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
paymentReportEndpointParsed.searchParams.set('START_DATE', startOfLastMonth);
paymentReportEndpointParsed.searchParams.set('END_DATE', endOfLastMonth);

export const calculateImpactRadiusUserPayment = async (): Promise<any> => {
  const {
    data: { Records: actionsListRaw },
  } = await axios.get(paymentReportEndpointParsed.href);

  const paidAndApproved: ImpactRadiusPayment[] = [];
  actionsListRaw.forEach((action: any) => {
    const cleanAction: ImpactRadiusPayment = camelcaseKeys(action);
    const userId = cleanAction.subId1;
    if (userId && !Number.isNaN(userId)) {
      const data = dto.paymentDTO.impactRadiusPaymentDto(cleanAction);
      if (data.status.toLowerCase() === 'approved' && data.statusDetail.toLowerCase() === 'paid') {
        paidAndApproved.push(data);
      }
    }
  });

  const paymentsByUser = paidAndApproved.reduce((acc: IPaymentByUser, curr) => {
    if (acc[curr.userId]) {
      acc[curr.userId] += Number(curr.payout);
    } else {
      acc[curr.userId] = Number(curr.payout);
    }
    return acc;
  }, {});

  const formatedTotalPayments = Object.entries(paymentsByUser).reduce((acc: any, curr) => {
    const [userId, amount] = curr;
    const userCommission: any = (amount / 2).toFixed(2);
    acc.push({ userId, amount: userCommission, type: 'IR', status: 'pending' });
    return acc;
  }, []);

  if (formatedTotalPayments.length) {
    // save to db
  }

  return formatedTotalPayments;
};
