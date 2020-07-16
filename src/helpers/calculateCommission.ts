import { messages } from './constants';

/**
 * @description calculate the user cash back amount
 * @param commission the commission given to Chirpyest
 * @return {Number} The cashback given to Chirpyest user
 */

const calculateCommission = (commission: number): number => {
  if (typeof commission !== 'number') {
    throw new Error(messages.general.commissionTypeError);
  }
  const userCashBack = Math.round(commission / 2);
  return userCashBack;
};

export default calculateCommission;
