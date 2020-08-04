import { FinancialDashboardAttributes } from './Networks';

export enum UserTypes {
  Admin = 'admin',
  Customer = 'customer',
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  type?: UserTypes;
  newsletterSubscription: boolean;
  termsCondsAccepted: boolean;
  paypalAccount?: string;
  username?: string;
  image?: string;
  isActive?: boolean;
  cognitoId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  financialDashboard?: FinancialDashboardAttributes;
}

export interface EditUserAttributes {
  name?: string;
  type?: UserTypes;
  username?: string;
  newsletterSubscription?: boolean;
  paypalAccount?: string;
  isActive?: boolean;
  cognitoId?: string;
}

export interface UserData extends UserAttributes {
  password: string;
}
export interface UserId {
  id: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  newsletterSubscription: boolean;
  paypalAccount: string;
  image: string;
  financialData?: FinancialDashboardAttributes;
}

export interface ProfileUpdatableFields {
  name: string;
  username: string;
  newsletterSubscription: boolean;
  paypalAccount: string;
  image: string;
}
