import { UserData } from '../../interfaces/Users';

export const userData = (data: any): UserData => ({
  email: data.email,
  password: data.password,
  cognito_id: data.cognitoId,
  name: data.name,
  newsletter_subscription: data.newsletter_subscription,
  terms_conds_accepted: data.terms_conds_accepted,
});
