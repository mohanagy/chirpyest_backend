import {
  BrandsAttributes,
  CommissionJunctionData,
  CommissionJunctionPayload,
  CommissionJunctionPayloadItem,
  UpdatePendingCashAttributes,
} from '../../interfaces/Networks';
import { commissionJunctionTrackingLink } from '../constants';
import convertToCents from '../convertToCents';

export const commissionJunctionData = (data: CommissionJunctionPayload): CommissionJunctionData =>
  data.map((row: CommissionJunctionPayloadItem) => ({
    actionStatus: row.actionStatus,
    actionTrackerId: row.actionTrackerId,
    userId: row.shopperId,
    advertiserId: row.advertiserId,
    actionTrackerName: row.actionTrackerName,
    advertiserName: row.advertiserName,
    pubCommissionAmountUsd: convertToCents(Number(row.pubCommissionAmountUsd)),
    saleAmountUsd: convertToCents(Number(row.saleAmountUsd)),
    correctionReason: row.correctionReason,
    postingDate: row.postingDate,
    orderDiscountUsd: convertToCents(Number(row.orderDiscountUsd)),
    aid: row.aid,
    orderId: row.orderId,
    commissionId: row.commissionId,
    saleAmountPubCurrency: convertToCents(Number(row.saleAmountPubCurrency)),
    orderDiscountPubCurrency: convertToCents(Number(row.orderDiscountPubCurrency)),
  }));

export const updatePendingCashData = (data: any): UpdatePendingCashAttributes => ({
  commissions: data.commissions,
  saleAmount: data.saleAmount,
});

export const commissionJunctionWebhookSecret = (data: any): string | undefined => data['x-webhook-secret'];

const getCjCommissionPercent = (action: any): string => {
  if (typeof action === 'object' && !Array.isArray(action)) {
    if (typeof action.commission.default === 'object') {
      return 'unknown';
    }
    return action.commission.default;
  }
  if (Array.isArray(action)) {
    if (typeof action[0].commission.default === 'object') {
      return 'unknown';
    }
    return action[0].commission.default;
  }
  throw new Error('Not a valid commission percent');
};

export const commissionJunctionBrands = (data: any): BrandsAttributes => {
  return {
    brandName: data.advertiserName,
    url: data.programUrl,
    brandId: data.advertiserId,
    trackingLink: commissionJunctionTrackingLink,
    status: data.accountStatus,
    commission: getCjCommissionPercent(data.actions.action),
    network: 'commissionJunction',
  };
};
