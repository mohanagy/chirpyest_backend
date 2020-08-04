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
