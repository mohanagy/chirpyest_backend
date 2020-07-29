import { RakutenTransactionsAttributes, UpdatePendingCashAttributes } from '../../interfaces/Networks';
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

// match 0% to 100%
const regx = /(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)%/;
export const rakutenBrandsData = (data: any): any => {
  return {
    brandName: data['Advertiser Name'],
    url: data['Advertiser URL'],
    brandId: data.MID,
    trackingLink: data['Link to Home Page'],
    status: data.Status,
    returnDays: data['Return Days'],
    transactionUpdateWindow: data['Transaction Update Window'],
    commission: data['Commission Terms'].match(regx)[0],
  };
};

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});
