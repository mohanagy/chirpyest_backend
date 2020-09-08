import moment from 'moment';
import { BrandsAttributes, ImpactRadiusAttributes } from '../../interfaces/Networks';
import convertToCents from '../convertToCents';

export const impactRadiusActions = (data: any): ImpactRadiusAttributes => {
  return {
    userId: data.subId1,
    campaignName: data.campaignName,
    campaignId: data.campaignId,
    actionTrackerId: data.actionTrackerId,
    actionId: data.id, // The unique ID that Impact Radius has assigned to the action.
    status: data.state?.toLowerCase(),
    adId: data.adId,
    orderId: data.oid,
    payout: convertToCents(Number(data.payout)),
    deltaPayout: convertToCents(Number(data.deltaPayout)),
    intendedPayout: convertToCents(Number(data.intendedPayout)),
    amount: convertToCents(Number(data.amount)),
    deltaAmount: convertToCents(Number(data.deltaAmount)),
    intendedAmount: convertToCents(Number(data.intendedAmount)),
    currency: data.currency,
    eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    creationDate: data.creationDate ? new Date(data.creationDate) : undefined,
    lockingDate: data.lockingDate ? new Date(data.lockingDate) : undefined,
    clearedDate: data.clearedDate ? new Date(data.clearedDate) : undefined,
    referringDomain: data.referringDomain,
    subId1: data.subId1,
    subId2: data.subId2,
    subId3: data.subId3,
    promoCode: data.promoCode,
  };
};

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
  payout: convertToCents(Number(data.payout)),
  deltaPayout: convertToCents(Number(data.deltaPayout)),
  intendedPayout: convertToCents(Number(data.intendedPayout)),
  amount: convertToCents(Number(data.amount)),
  deltaAmount: convertToCents(Number(data.deltaAmount)),
  intendedAmount: convertToCents(Number(data.intendedAmount)),
  currency: data.currency,
  originalCurrency: data.originalCurrency,
  originalAmount: convertToCents(Number(data.originalAmount)),
  eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
  creationDate: data.creationDate ? new Date(data.creationDate) : undefined,
  lockingDate: data.lockingDate ? new Date(data.lockingDate) : undefined,
  clearedDate: data.clearedDate ? new Date(data.clearedDate) : undefined,
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
    date: moment(data.dateDisplay, 'MMM DD, YYYY').format('YYYY-MM-DD'),
    revenues: Number(data.totalCost),
  };
};
