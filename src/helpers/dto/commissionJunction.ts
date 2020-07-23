import {
  CommissionJunctionData,
  CommissionJunctionPayload,
  CommissionJunctionPayloadItem,
  UpdatePendingCashAttributes,
} from '../../interfaces/Networks';
import convertToCents from '../convertToCents';

export const commissionJunctionData = (data: CommissionJunctionPayload): CommissionJunctionData =>
  data.map((row: CommissionJunctionPayloadItem) => ({
    actionTrackerId: row.actionTrackerId,
    userId: row.shopperId,
    advertiserId: row.advertiserId,
    actionTrackerName: row.actionTrackerName,
    advertiserName: row.advertiserName,
    pubCommissionAmountUsd: convertToCents(row.pubCommissionAmountUsd),
    saleAmountUsd: row.saleAmountUsd,
    correctionReason: row.correctionReason,
    postingDate: row.postingDate,
    orderDiscountUsd: row.orderDiscountUsd,
    aid: row.aid,
    orderId: row.orderId,
    commissionId: row.commissionId,
    saleAmountPubCurrency: row.saleAmountPubCurrency,
    orderDiscountPubCurrency: row.orderDiscountPubCurrency,
  }));

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});

export const commissionJunctionWebhookSecret = (data: any): string | undefined => data['x-webhook-secret'];
