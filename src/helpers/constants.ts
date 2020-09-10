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
  brands: {
    linkNotRelatedToOurNetwork: 'Sorry, this link is not in our network',
  },
  newsletter: {
    userSubscribed: ' User has been Subscribed',
  },
};

export const commissionJunctionCronJobPattern = '0 3 * * *'; // check https://crontab.guru/ for more information
export const brandsCronJobPattern = '0 3 * * *'; // check https://crontab.guru/ for more information
export const calculatePaymentsCronJobPattern = '0 3 1,16 * *'; // check https://crontab.guru/ for more information
export const syncTransactionsCronJobPattern = '0 4 * * *'; // check https://crontab.guru/ for more information
export const preparingPaymentsCronJobPattern = '0 3 1,16 * *'; // check https://crontab.guru/ for more information
export const sendingPaymentsCronJobPattern = '0 5 4,20 * *'; // check https://crontab.guru/ for more information
export const checkingPaymentsCronJobPattern = '0 6 * * *'; // check https://crontab.guru/ for more information

export const commissionJunctionBaseUrl = 'https://commissions.api.cj.com/query';

export const commissionJunctionTrackingLink = 'https://www.anrdoezrs.net/links/4014745/type/am/sid/defaultvalue';

const { commissionJunctionConfig } = config.affiliateNetworks;

export const commissionJunctionBrandsUrl = `https://advertiser-lookup.api.cj.com/v2/advertiser-lookup?requestor-cid=${commissionJunctionConfig.cJPublisherId}&advertiser-ids=joined&records-per-page=100`;

export const rakutenBrandsUrl = `http://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=13`;

const { accountSID, authToken, account2SID, authToken2 } = config.affiliateNetworks.impactRadiusConfig;

const baseImpactApiUrl = `https://${accountSID}:${authToken}@api.impact.com/Mediapartners/${accountSID}`;
export const campaignsEndpoint = `${baseImpactApiUrl}/Campaigns.json`;
export const campaignsEndpoint2 = `${baseImpactApiUrl}/Reports/4016?PageSize=20000&Page=1&contract_status=Active`;

const baseImpactAccount2ApiUrl = `https://${account2SID}:${authToken2}@api.impact.com/Mediapartners/${account2SID}`;

export const ir2CampaignsEndpoint = `${baseImpactAccount2ApiUrl}/Campaigns.json`;
export const ir2CampaignsEndpoint2 = `${baseImpactAccount2ApiUrl}/Reports/4016?PageSize=20000&Page=1&contract_status=Active`;

export const paymentReportEndpointAccount1 = `${baseImpactApiUrl}/Reports/mp_action_listing_sku.json?SUPERSTATUS_MS=APPROVED&SUPERSTATUS_MS=NA&SUPERSTATUS_MS=PENDING&PUB_CAMPAIGN_MS=0&MP_CATEGORY_LIST2=0&PAYSTUB_ID=0&MODIFIED_Y_N=0&PUB_ACTION_TRACKER=0&MP_ACTION_TYPE=0&ADV_PROMOCODE=0&SUBID1=0&SUBID2=0&SUBID3=0&SHAREDID=0&REFERRAL_TYPE=0&ACTION_ID=0&ADV_NOTE=0&SHOW_STATUS_DETAIL=1&timeRange=CUSTOM&compareEnabled=false`;

export const paymentReportEndpointAccount2 = `${baseImpactAccount2ApiUrl}/Reports/mp_action_listing_sku.json?SUPERSTATUS_MS=APPROVED&SUPERSTATUS_MS=NA&SUPERSTATUS_MS=PENDING&PUB_CAMPAIGN_MS=0&MP_CATEGORY_LIST2=0&PAYSTUB_ID=0&MODIFIED_Y_N=0&PUB_ACTION_TRACKER=0&MP_ACTION_TYPE=0&ADV_PROMOCODE=0&SUBID1=0&SUBID2=0&SUBID3=0&SHAREDID=0&REFERRAL_TYPE=0&ACTION_ID=0&ADV_NOTE=0&SHOW_STATUS_DETAIL=1&timeRange=CUSTOM&compareEnabled=false`;

export const impactRadiusActionsListEndpint1 = `${baseImpactApiUrl}/Actions.json?SHOW_STATUS_DETAIL=1`;

export const impactRadiusActionsListEndpint2 = `${baseImpactAccount2ApiUrl}/Actions.json?SHOW_STATUS_DETAIL=1`;
export const dailyReportsEndPoint1 = `${baseImpactApiUrl}/Reports/mp_performance_by_day.json?PUB_CAMPAIGN=0&timeRange=CUSTOM&compareEnabled=false`;
export const dailyReportsEndPoint2 = `${baseImpactAccount2ApiUrl}/Reports/mp_performance_by_day.json?PUB_CAMPAIGN=0&timeRange=CUSTOM&compareEnabled=false`;

// match 0% to 100%
export const percentageRegx = /(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)%/g;

export const paymentSummaryEndpoint = `https://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&nid=1&reportid=1`;
export const paymentHistoryEndpoint = `https://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=2`;
export const paymentDetailsReportEndpoint = `https://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=3&invoiceid=1142851`;

export const rakutenByDayReport = `https://ran-reporting.rakutenmarketing.com/en/reports/revenue-report-by-day/filters?start_date=2020-08-01&end_date=2020-08-31&include_summary=N&network=1&tz=GMT&date_type=transaction&token=${config.affiliateNetworks.rakutenConfig.rakutenReportToken}`;

export const PENDING = 'pending';
export const PROCESSING = 'processing';
export const SUCCESS = 'success';
export const PREPARING = 'preparing';

export const payPalEndpoint =
  process.env.NODE_ENV === 'production' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';

export const zeroCashBack = '0%';

export const trendingBrands = [
  { id: '59720_2092', name: 'Target' },
  { id: '2423467', name: 'Revolve' },
  { id: '4942550', name: 'Nike' },
  { id: '396110_5553', name: 'Gap' },
  { id: '355678', name: 'Goop' },
  { id: '43728', name: 'UGG' },
  { id: '396113_5556', name: 'Athleta' },
  { id: '40776', name: 'MOTHER Denim' },
  // { id: '4258829', name: 'Barnes & Noble' },
  { id: '4964921', name: 'Kenneth Cole' },
  { id: '1463156', name: 'Oakley' },
  { id: '225976_4270', name: 'Adidas' },
  { id: '1237', name: 'Nordstrom' },
  { id: '5206455', name: 'Wayfair' },
  { id: '37723', name: 'Zadig & Voltaire' },
  { id: '97526_2835', name: 'Sigma beauty' },
  { id: '5253058', name: 'LaCoste' },
  { id: '2954255', name: 'Sonos' },
  { id: '2568723', name: 'Walgreens' },
  { id: '355678_5118', name: 'Goop' },
  { id: '1244771_8471', name: 'Arhaus' },
  { id: '1225650_8270', name: 'The RealReal' },
];

interface BrandsCategoreis {
  [key: string]: any;
}

export const brandsCategories: BrandsCategoreis = {
  '1237': {
    name: 'Nordstrom',
    id: '1237',
    category: 'fashion',
  },
  '43176': {
    name: 'Urban Outfitters',
    id: '43176',
    category: 'fashion',
  },
  '5253058': {
    name: 'Lacoste',
    id: '5253058',
    category: 'fashion',
  },
  '42004': {
    name: 'Kate Spade',
    id: '42004',
    category: 'fashion',
  },

  'Beauty Counter': {
    name: 'Beauty Counter',
    id: '',
    category: 'beauty',
  },
  '24765': {
    name: 'Benefit',
    id: '24765',
    category: 'beauty',
  },
  '97526_2835': {
    name: 'Sigma Beauty',
    id: '97526_2835',
    category: 'beauty',
  },
  '36310': {
    name: 'Dyson',
    id: '36310',
    category: 'beauty',
  },
  '3009921': {
    name: 'Stila',
    id: '3009921',
    category: 'beauty',
  },
  '37353': {
    name: 'Container Store',
    id: '37353',
    category: 'home',
  },
  '4867369': {
    name: 'One Kings Lane',
    id: '4867369',
    category: 'home',
  },
  '1845109': {
    name: 'KitchenAid',
    id: '1845109',
    category: 'home',
  },
  '1213441_8154': {
    name: 'Home Depot',
    id: '1213441_8154',
    category: 'home',
  },
  '2149': {
    name: 'Walmart',
    id: '2149',
    category: 'lifestyle',
  },
  '4836691': {
    name: 'CVS',
    id: '4836691',
    category: 'lifestyle',
  },
  '1434782': {
    name: 'Best Buy',
    id: '1434782',
    category: 'lifestyle',
  },
  '1355298_9368': {
    name: 'QVC',
    id: '1355298_9368',
    category: 'lifestyle',
  },
};

export const lifestyle = ['2149', '2149', '4836691', '1434782', '1355298_9368'];
export const home = ['37353', '4867369', '1845109', '1213441_8154'];
export const beauty = ['24765', '36310', '3009921', '97526_2835'];
export const fashion = ['1237', '43176', '5253058', '42004'];

export const emailTemplates = {
  contactForm: 'd-25453c7c6d9a4040b4e5b08834a0a313',
  joinChirpyest: 'd-d87fffa6cd9e4e9787eb1aac48f67094',
  reminder: 'd-1c26c4d6b74649a78ac490ef0998a1ac',
  partiallyJoinedToChirpyest: 'd-a3089d3089264ab78b4e55d26201b72b',
  howItWorks: 'd-bc1174663afa410d895eff907f49bb2d',
  brandsHighlight: ' d-9788ed8d38bd41f6b080bb77ae501242',
  completeProfile: 'd-822636d5b3914e8ba8c2ba18c9b8256d',
  discountHighlights: 'd-05e90d45bf66495a99594d503f6ba989',
  extensionReminder: 'd-e4899b14194e409683fea4c9fd9f28ed',
  gotCashCongrats: 'd-589929026e184bf1aa607e70eb0dced6',
  hotList: 'd-71d615d1e00b4ac88b8cb84e1d7d2fd6',
  joinReminder: 'd-fddb26c02a60481587d8167fcc1387af',
  newsletter: 'd-f10aa006c65d4a7bae1f5a6d1bd3a64f',
  passwordReset: 'd-ae8a0411c08b406494417929444fb82c',
  welcomeNeedExtension1: 'd-f5676d228f364b32a5801e337fc120ee',
  welcomeNeedExtension2: 'd-67e9e1ff8fad4bfd8e6f8b295769d01e',
};
