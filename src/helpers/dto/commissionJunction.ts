import {
  BrandsAttributes,
  CommissionJunctionData,
  CommissionJunctionPayload,
  CommissionJunctionPayloadItem,
  UpdatePendingCashAttributes,
} from '../../interfaces/Networks';
import { commissionJunctionTrackingLink } from '../constants';
import convertToCents from '../convertToCents';
import { removeTrailingZeros } from '../removeTrailingZeros';

export const commissionJunctionData = (data: CommissionJunctionPayload): CommissionJunctionData =>
  data.map((row: CommissionJunctionPayloadItem) => ({
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

const getOrderLevelCommission = (text: string, type: string) => {
  const regex = /\d*.?\d+/;
  const matchedArr = text.match(regex);
  if (!matchedArr) {
    return 'unknown';
  }
  const commission = matchedArr[0];
  const userCommission = Number(commission) / 2;
  return `${userCommission.toString()} USD per ${type}`;
};

const getCjCommissionPercent = (action: any): string => {
  if (typeof action === 'object' && !Array.isArray(action)) {
    if (typeof action.commission.default === 'object') {
      switch (action.commission.default.$.type) {
        case 'order-level':
          return getOrderLevelCommission(action.commission.default._, 'order');
        case 'item-level':
          return getOrderLevelCommission(action.commission.default._, 'item');
        default:
          return 'unknown';
      }
    }
    return removeTrailingZeros(action.commission.default);
  }
  if (Array.isArray(action)) {
    const commissionsSet: Set<number> = new Set();
    action.forEach((item) => {
      if (typeof item.commission.default === 'string') {
        const percent = item.commission.default.split('%')[0];
        const userPercent = Number(percent) / 2;
        commissionsSet.add(userPercent);
      }
    });

    const commissionsArray: number[] = [...commissionsSet];
    if (!commissionsArray.length) {
      return 'unknown';
    }

    const sorted = commissionsArray.sort((a: number, b: number) => {
      return a - b;
    });
    let result = '';
    if (sorted.length === 1) {
      result = `${removeTrailingZeros(sorted[0].toString())}%`;
    } else {
      result = `${removeTrailingZeros(sorted[sorted.length - 1].toString())}%`;
    }
    return result;
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
