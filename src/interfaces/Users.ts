import { UserTypes } from '../helpers/constants';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  type?: UserTypes;
  newsletterSubscription: boolean;
  termsCondsAccepted: boolean;
  paypalAccount?: string;
  image?: string;
  isActive?: boolean;
  cognitoId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditUserAttributes {
  name?: string;
  type?: UserTypes;
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
  newsletterSubscription: boolean;
  paypalAccount: string;
  image: string;
}

export interface ProfileUpdatableFields {
  name: string;
  newsletterSubscription: boolean;
  paypalAccount: string;
  image: string;
}
