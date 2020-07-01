/* eslint-disable max-classes-per-file */
import { BuildOptions, Model } from 'sequelize';
import { UserAttributes } from '../../interfaces';

export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): UserModel;
};
