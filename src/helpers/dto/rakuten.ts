import { RakutenTransactionsAttributes, UpdatePendingCashAttributes } from '../../interfaces/Networks';
import { percentageRegx } from '../constants';
import convertToCents from '../convertToCents';

export const rakutenData = (data: any): RakutenTransactionsAttributes => ({
  userId: data.u1,
  etransactionId: data.etransaction_id,
  orderId: data.order_id,
  offerId: data.offer_id,
  skuNumber: data.sku_number,
  quantity: data.quantity,
  saleAmount: convertToCents(data.sale_amount),
  commissions: convertToCents(data.commissions),
  processDate: data.process_date,
  transactionDate: data.transaction_date,
  transactionType: data.transaction_type,
  productName: data.product_name,
  currency: data.currency,
  isEvent: data.is_event,
  u1: data.u1,
});

export const rakutenBrandsData = (data: any): any => {
  return {
    brandName: data['Advertiser Name'],
    url: `https://click.linksynergy.com/deeplink?id=Aq5kmT*JPrM&mid=${data.MID}`,
    brandId: data.MID,
    trackingLink: data['Link to Home Page'],
    status: data.Status,
    commission: data['Commission Terms'].match(percentageRegx)[0],
    network: 'rakuten',
  };
};

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});
