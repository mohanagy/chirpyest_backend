import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { URL } from 'url';
import { constants, dto, convertToCents, getHalfMonthRange } from '../../helpers';
import { ImpactRadiusPayment, IPaymentByUser } from '../../interfaces';

const { paymentReportEndpoint } = constants;

const paymentReportEndpointParsed = new URL(paymentReportEndpoint);

export const calculateImpactRadiusUserPayment = async (): Promise<any> => {
  const { start, end, halfMonthId } = getHalfMonthRange();
  const startOfLastMonth = start.format('YYYY-MM-DD');
  const endOfLastMonth = end.format('YYYY-MM-DD');
  paymentReportEndpointParsed.searchParams.set('START_DATE', startOfLastMonth);
  paymentReportEndpointParsed.searchParams.set('END_DATE', endOfLastMonth);
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
    const userCommission = convertToCents(Number(amount) / 2);
    acc.push({ userId, amount: userCommission, type: 'IR', status: 'pending', halfMonthId });
    return acc;
  }, []);
  return formatedTotalPayments;
};
