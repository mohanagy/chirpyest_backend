import { Authorization, CognitoAttributes } from '../../interfaces';

export const cognitoAttributes = (data: any): CognitoAttributes => ({
  name: data.name,
  email: data.email,
  'custom:user_id': data.id,
  picture: data.image,
});

export const authorizationToken = (data: any): Authorization => ({
  authorization: data.authorization,
});