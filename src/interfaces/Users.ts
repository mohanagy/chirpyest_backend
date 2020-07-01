import { UserTypes } from '../helpers/constants';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  type?: UserTypes;
  newsletter_subscription: boolean;
  terms_conds_accepted: boolean;
  paypal_account?: string;
  image?: string;
  is_active?: boolean;
  cognito_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditUserAttributes {
  name?: string;
  type?: UserTypes;
  newsletter_subscription?: boolean;
  paypal_account?: string;
  is_active?: boolean;
  cognito_id?: string;
}

export interface UserData extends UserAttributes {
  password: string;
}
