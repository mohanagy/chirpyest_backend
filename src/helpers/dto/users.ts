import { UserTypes } from '../../interfaces';
import { ProfileUpdatableFields, UserData, UserId, UserProfileResponse } from '../../interfaces/Users';

export const userData = (data: any): UserData => ({
  email: data.email,
  password: data.password,
  username: data.username,
  cognitoId: data.cognitoId,
  name: data.email.split('@')[0],
  newsletterSubscription: data.newsletterSubscription,
  termsCondsAccepted: data.termsCondsAccepted,
  extensionDownloaded: data.extensionDownloaded,
  signedInFromExtension: data.signedInFromExtension,
  type: data.type || UserTypes.Customer,
  image: data.image,
});

export const userId = (data: any): UserId => ({
  id: data.params.id,
});

export const userProfileResponse = (data: any): UserProfileResponse => ({
  id: data.id,
  name: data.name,
  email: data.email,
  username: data.username,
  newsletterSubscription: data.newsletterSubscription,
  paypalAccount: data.paypalAccount,
  image: data.image,
  financialData: data.financialDashboard,
});
export const userProfileUpdatableFields = (data: any): ProfileUpdatableFields => ({
  name: data.name,
  username: data.username,
  newsletterSubscription: data.newsletterSubscription,
  paypalAccount: data.paypalAccount,
  image: data.image,
});
