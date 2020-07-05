import { UserData } from '../../interfaces/Users';
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
