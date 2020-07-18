import { ImpactRadiusAttributes } from '../../interfaces/Networks';
import convertToCents from '../convertToCents';

export const impactRadiusData = (data: any): ImpactRadiusAttributes => ({
  userId: data.subId1,
  token: data.token,
  campaignName: data.campaignName,
  actionTrackerId: data.actionTrackerId,
  actionId: data.actionId, // The unique ID that Impact Radius has assigned to the action.
  status: data.status,
  statusDetail: data.statusDetail,
  adId: data.adId,
  payout: convertToCents(data.payout),
  deltaPayout: convertToCents(data.deltaPayout),
  intendedPayout: convertToCents(data.intendedPayout),
  amount: convertToCents(data.amount),
  deltaAmount: convertToCents(data.deltaAmount),
  intendedAmount: convertToCents(data.intendedAmount),
  currency: data.currency,
  originalCurrency: data.originalCurrency,
  originalAmount: data.originalAmount,
  eventDate: data.eventDate,
  creationDate: data.creationDate,
  lockingDate: data.lockingDate,
  clearedDate: data.clearedDate,
  referringDomain: data.referringDomain,
  landingPageUrl: data.landingPageUrl,
  subId1: data.subId1,
  subId2: data.subId2,
  subId3: data.subId3,
  promoCode: data.promoCode,
});
