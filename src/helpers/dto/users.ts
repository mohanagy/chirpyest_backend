import { ProfileUpdatableFields, UserData, UserId, UserProfileResponse } from '../../interfaces/Users';
import { UserTypes } from '../constants';

export const userData = (data: any): UserData => ({
  email: data.email,
  password: data.password,
  cognitoId: data.cognitoId,
  name: data.name,
  newsletterSubscription: data.newsletterSubscription,
  termsCondsAccepted: data.termsCondsAccepted,
  type: data.type || UserTypes.Customer,
  image: data.image,
});

export const userId = (data: any): UserId => ({
  id: data.params.id,
});

export const userProfileResponse = (data: any): UserProfileResponse => ({
  id: data.id,
  name: data.name,
  newsletterSubscription: data.newsletterSubscription,
  paypalAccount: data.paypalAccount,
  image: data.image,
});
export const userProfileUpdatableFields = (data: any): ProfileUpdatableFields => ({
  name: data.name,
  newsletterSubscription: data.newsletterSubscription,
  paypalAccount: data.paypalAccount,
  image: data.image,
});
