export enum UserTypes {
  Admin = 'admin',
  Customer = 'customer',
}

export const messages = {
  auth: {
    userAlreadyExists: 'User already exists',
    userHasBeenCreated: 'User has been created',
  },
  general: {
    notFound: 'Not found',
    commissionTypeError: 'TypeError: commission must be a number',
  },
};
