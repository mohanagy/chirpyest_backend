export enum UserTypes {
  Admin = 'admin',
  Customer = 'customer',
}

export const messages = {
  auth: {
    userAlreadyExists: 'User Already Exists',
    userHasBeenCreated: 'User Has Been Created',
    notAuthorized: 'Not Authorized',
  },
  general: {
    notFound: 'Not Found',
    internalServerError: 'Internal Server Error',
    commissionTypeError: 'TypeError: commission must be a number',
    forbidden: 'Forbidden',
    pendingField: 'pending',
  },
  users: {
    userProfile: 'User Profile',
    updateUserProfileSuccess: 'User Profile Updated Successfully',
  },
};

export const commissionJunctionCronJobPattern = '* * * * *'; // check https://crontab.guru/ for more information
