import { messages } from '../../helpers/constants';

/**
 * @description calculate the user cash back amount
 * @param commission the commission given to chirpyest
 * @return Number
 */

export const calculateCommission = (commission: number): number => {
  if (typeof commission !== 'number') {
    throw new Error(messages.general.commissionTypeError);
  }
  const userCashBack = Math.round(commission / 2);
  return userCashBack;
};
