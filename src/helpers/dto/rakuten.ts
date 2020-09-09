import _ from 'lodash';
import moment from 'moment';
import { RakutenTransactionsAttributes, UpdatePendingCashAttributes } from '../../interfaces/Networks';
import { percentageRegx } from '../constants';
import convertToCents from '../convertToCents';

export const rakutenData = (data: any): RakutenTransactionsAttributes => ({
  userId: Number(data.u1),
  etransactionId: data.etransaction_id,
  orderId: data.order_id,
  offerId: data.offer_id,
  advertiserId: data.advertiser_id,
  skuNumber: data.sku_number,
  quantity: data.quantity,
  saleAmount: convertToCents(Number(data.sale_amount)),
  commissions: convertToCents(Number(data.commissions)),
  processDate: data.process_date,
  transactionDate: data.transaction_date,
  transactionType: data.transaction_type,
  productName: data.product_name,
  currency: data.currency,
  isEvent: data.is_event,
  u1: data.u1,
});

export const rakutenBrandsData = (data: any): any => {
  const commissionTerms = data['Commission Terms'].match(percentageRegx);
  const baselineCommissionTerms = data['Baseline Commission Terms'].match(percentageRegx);
  const allCommistionsArr = commissionTerms.concat(baselineCommissionTerms);

  const commissionsNumbers = allCommistionsArr.map((item: any) => {
    if (!item) {
      return 0;
    }
    return Number(item.split('%')[0]);
  });
  const finalCommission = _.max(commissionsNumbers);
  const cleanPercent = `${Number(finalCommission) / 2}%`;

  return {
    brandName: data['Advertiser Name'],
    url: data['Advertiser URL'].toLowerCase(),
    brandId: data.MID,
    trackingLink: `https://click.linksynergy.com/deeplink?id=Aq5kmT*JPrM&mid=${data.MID}`,
    status: data.Status,
    commission: cleanPercent,
    network: 'rakuten',
  };
};

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});

export const rakutenTotalRevenuesData = (data: any): any => {
  return {
    date: moment(data.transactionDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    revenues: Number(data.totalCommission),
  };
};
