import { UserTypes } from '../helpers/constants';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  cognitoId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditUserAttributes {
  type?: UserTypes;
  name?: string;
}

export interface UserData extends UserAttributes {
  password: string;
}
