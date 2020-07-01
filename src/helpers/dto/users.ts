import { UserData } from '../../interfaces/Users';

interface Generic {
  [key: string]: string;
}

export const userData = (data: Generic): UserData => ({
  email: data.email,
  password: data.password,
  cognitoId: data.cognitoId,
  name: data.name,
});
