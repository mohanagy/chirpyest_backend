import { messages } from './constants';

/**
 * @description calculate the user cash back amount in dollars
 * @param {Number} value the total commission Chirpyest earned from the user
 * @return {Number} The cashback given to Chirpyest user
 */

const calculateUserPendingCash = (value: number): number => {
  if (typeof value !== 'number') {
    throw new Error(messages.general.commissionTypeError);
  }
  return Math.floor(value / 2) / 100;
};

export default calculateUserPendingCash;
