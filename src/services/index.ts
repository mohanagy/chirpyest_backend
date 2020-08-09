import * as AffiliateNetworks from './affiliateNetworks';
import * as impactRadius from './affiliateNetworks/impactRadius';
import * as rakuten from './affiliateNetworks/rakuten';
import * as brands from './brands';
import * as cashBack from './cashback';
import * as financialDashboard from './financialDashboard';
import * as payments from './payments';
import * as Users from './users';

export const rakutenServices = rakuten;
export const impactRadiusServices = impactRadius;
export const usersServices = Users;
export const cashBackService = cashBack;
export const financialDashboardService = financialDashboard;
export const affiliateNetworksServices = AffiliateNetworks;
export const brandsService = brands;
export const paymentsService = payments;
