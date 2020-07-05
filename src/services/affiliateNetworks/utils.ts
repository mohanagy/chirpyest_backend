import { messages } from '../../helpers/constants';

export const calculateCommission = (commission: number): number => {
  if (typeof commission !== 'number') {
    throw new Error(messages.general.commissionTypeError);
  }
  const userCashBack = Math.round(commission / 2);
  return userCashBack;
};
