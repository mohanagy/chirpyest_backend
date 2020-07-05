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
