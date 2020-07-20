/**
 * @description Convert dollars to cents
 * @param {Number} value the cash amount by dollars
 * @return {Number}
 */

const convertToCents = (value: number): number => {
  return Math.floor(value * 100);
};

export default convertToCents;
