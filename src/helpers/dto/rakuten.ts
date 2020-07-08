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

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});
