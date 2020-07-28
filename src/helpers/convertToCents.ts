/**
 * @description Convert dollars to cents
 * @param {Number} value the cash amount by dollars
 * @return {Number}
 */

const convertToCents = (value: number): number => {
  if (typeof value === 'number') return Math.floor(value * 100);
  return 0;
};

export default convertToCents;
