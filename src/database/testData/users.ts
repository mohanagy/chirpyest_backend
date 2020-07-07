import { Users } from '..';
import { UserTypes } from '../../helpers/constants';

const customer1: any = {
  email: 'abdalsamad@kiitos-tech.com',
  password: 'Pass123!',
  termsCondsAccepted: true,
  type: UserTypes.Customer,
};

const customer2: any = {
  email: 'abdalsamad.y.m@gmail.com',
  password: 'Pass123!',
  termsCondsAccepted: true,
  type: UserTypes.Customer,
};

export const createUsers = async (): Promise<any> => {
  const [user1, user2] = await Users.bulkCreate([customer1, customer2], { returning: true });
  return { user1, user2 };
};
