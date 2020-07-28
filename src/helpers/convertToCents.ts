/**
 * @description Convert dollars to cents
 * @param {Number} value the cash amount by dollars
 * @return {Number}
 */

const convertToCents = (value: number): number => {
  if (!Number.isNaN(value)) return Math.floor(value * 100);
  return 0;
};

export default convertToCents;
