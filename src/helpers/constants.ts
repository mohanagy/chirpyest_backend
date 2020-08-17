import config from '../config';

export const messages = {
  auth: {
    userAlreadyExists: 'User Already Exists',
    userHasBeenCreated: 'User Has Been Created',
    notAuthorized: 'Not Authorized',
  },
  general: {
    notFound: 'Not Found',
    internalServerError: 'Internal Server Error',
    commissionTypeError: 'TypeError: commission must be a number',
    forbidden: 'Forbidden',
    pendingField: 'pending',
  },
  users: {
    userProfile: 'User Profile',
    updateUserProfileSuccess: 'User Profile Updated Successfully',
  },
};

export const commissionJunctionCronJobPattern = '0 0 * * *'; // check https://crontab.guru/ for more information
export const brandsCronJobPattern = '0 0 * * *'; // check https://crontab.guru/ for more information
export const calculatePaymentsCronJobPattern = '* * * * *'; // check https://crontab.guru/ for more information
export const preparingPaymentsCronJobPattern = '0 0 1 * *'; // check https://crontab.guru/ for more information
export const sendingPaymentsCronJobPattern = '0 0 4 * *'; // check https://crontab.guru/ for more information
export const checkingPaymentsCronJobPattern = '0 22 4 * *'; // check https://crontab.guru/ for more information

export const commissionJunctionBaseUrl = 'https://commissions.api.cj.com/query';

export const commissionJunctionTrackingLink = 'https://www.anrdoezrs.net/links/4014745/type/am/sid/defaultvalue';

const { commissionJunctionConfig } = config.affiliateNetworks;

export const commissionJunctionBrandsUrl = `https://advertiser-lookup.api.cj.com/v2/advertiser-lookup?requestor-cid=${commissionJunctionConfig.cJPublisherId}&advertiser-ids=joined&records-per-page=100`;

export const rakutenBrandsUrl = `http://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=13`;

const { accountSID, authToken } = config.affiliateNetworks.impactRadiusConfig;

const baseImpactApiUrl = `https://${accountSID}:${authToken}@api.impact.com/Mediapartners/${accountSID}`;
export const campaignsEndpoint = `${baseImpactApiUrl}/Campaigns.json`;
export const campaignsEndpoint2 = `${baseImpactApiUrl}/Reports/4016?PageSize=20000&Page=1&contract_status=Active`;

export const paymentReportEndpoint = `${baseImpactApiUrl}/Reports/mp_action_listing_sku.json?SUPERSTATUS_MS=APPROVED&SUPERSTATUS_MS=NA&SUPERSTATUS_MS=PENDING&PUB_CAMPAIGN_MS=0&MP_CATEGORY_LIST2=0&PAYSTUB_ID=0&MODIFIED_Y_N=0&PUB_ACTION_TRACKER=0&MP_ACTION_TYPE=0&ADV_PROMOCODE=0&SUBID1=0&SUBID2=0&SUBID3=0&SHAREDID=0&REFERRAL_TYPE=0&ACTION_ID=0&ADV_NOTE=0&SHOW_STATUS_DETAIL=1&START_DATE=2019-02-01&END_DATE=2019-12-07&timeRange=CUSTOM&compareEnabled=false`;

// match 0% to 100%
export const percentageRegx = /(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)%/;

export const paymentSummaryEndpoint = `https://reportws.linksynergy.com/downloadreport.php?bdate=20200101&edate=20200601&token=${config.affiliateNetworks.rakutenConfig.securityToken}&nid=1&reportid=1`;
export const paymentHistoryEndpoint = `https://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=2`;
export const paymentDetailsReportEndpoint = `https://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=3&invoiceid=1142851`;
export const PENDING = 'pending';
export const PROCESSING = 'processing';
export const SUCCESS = 'success';
export const PREPARING = 'preparing';

export const payPalEndpoint =
  process.env.NODE_ENV === 'production' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';
