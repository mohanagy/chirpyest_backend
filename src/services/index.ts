import * as AffiliateNetworks from './affiliateNetworks';
import * as impactRadius from './affiliateNetworks/impactRadius';
import * as rakuten from './affiliateNetworks/rakuten';
import * as cashBack from './cashback';
import * as financialDashboard from './financialDashboard';
import * as Users from './Users';

export const rakutenServices = rakuten;
export const impactRadiusServices = impactRadius;
export const usersServices = Users;
export const cashBackService = cashBack;
export const financialDashboardService = financialDashboard;
export const affiliateNetworksServices = AffiliateNetworks;