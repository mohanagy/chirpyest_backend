import { BrandsAttributes, ImpactRadiusAttributes } from '../../interfaces/Networks';
import convertToCents from '../convertToCents';
import isValidDate from '../isValidDate';

export const impactRadiusData = (data: any): ImpactRadiusAttributes => ({
  userId: data.subId1,
  token: data.token,
  campaignName: data.campaignName,
  campaignId: data.campaignId,
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
  originalAmount: convertToCents(data.originalAmount),
  eventDate: isValidDate(data.eventDate) ? data.eventDate : undefined,
  creationDate: isValidDate(data.creationDate) ? data.creationDate : undefined,
  lockingDate: isValidDate(data.lockingDate) ? data.lockingDate : undefined,
  clearedDate: isValidDate(data.clearedDate) ? data.clearedDate : undefined,
  referringDomain: data.referringDomain,
  landingPageUrl: data.landingPageUrl,
  subId1: data.subId1,
  subId2: data.subId2,
  subId3: data.subId3,
  promoCode: data.promoCode,
});

export const impactRadiusBrands = (data: any): BrandsAttributes => {
  return {
    brandName: data.CampaignName,
    url: data.CampaignUrl.toLowerCase(),
    brandId: `${data.AdvertiserId}_${data.CampaignId}`,
    trackingLink: data.TrackingLink,
    status: data.ContractStatus,
    commission: data.payout,
    network: 'impactRadius',
  };
};

export const impactRaduisDailyRevenues = (data: any): any => {
  return {
    date: data.dateDisplay,
    revenues: Number(data.totalCost).toFixed(2),
  };
};
