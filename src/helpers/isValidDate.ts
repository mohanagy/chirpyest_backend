/**
 https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
 */

/**
 * @description Check if a date object is a valid date
 * @param {Date} date The date object
 * @return {boolean}
 */
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !Number.isNaN(date);
};

export default isValidDate;
