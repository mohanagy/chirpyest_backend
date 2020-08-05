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

export const commissionJunctionBaseUrl = 'https://commissions.api.cj.com/query';

export const commissionJunctionTrackingLink = 'https://www.anrdoezrs.net/links/4014745/type/am/sid/defaultvalue';

const { commissionJunctionConfig } = config.affiliateNetworks;

export const commissionJunctionBrandsUrl = `https://advertiser-lookup.api.cj.com/v2/advertiser-lookup?requestor-cid=${commissionJunctionConfig.cJPublisherId}&advertiser-ids=joined`;

export const rakutenBrandsUrl = `http://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=13`;

const { accountSID, authToken } = config.affiliateNetworks.impactRadiusConfig;

const baseImpactApiUrl = `https://${accountSID}:${authToken}@api.impact.com/Mediapartners/${accountSID}`;
export const campaignsEndpoint = `${baseImpactApiUrl}/Campaigns.json`;
export const campaignsEndpoint2 = `${baseImpactApiUrl}/Reports/4016?PageSize=20000&Page=1&contract_status=Active`;

// match 0% to 100%
export const percentageRegx = /(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)%/;
