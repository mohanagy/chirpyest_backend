export const calculateCommission = (commission: number): number => {
  if (typeof commission !== 'number') {
    throw new Error(`commission must be a number instead got ${commission} `);
  }
  const userCashBack = Math.round(commission / 2);
  return userCashBack;
};
