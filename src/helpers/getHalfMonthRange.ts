import moment from 'moment';

const getHalfMonthRange = (): any => {
  const day = moment().date();
  let half = null;

  if (day > 15) {
    half = 0; // first half of the month
  } else {
    half = 1; // second half of the month
  }
  if (half === 1) {
    const start = moment().subtract(1, 'month').startOf('month').add(14, 'days');
    const end = moment().subtract(1, 'month').endOf('month');
    const month = moment().month();
    const year = moment().year();
    const halfMonthId = `${half}_${month}_${year}`;
    return { start, end, half, halfMonthId };
  }
  // second half
  const start = moment().subtract(1, 'month').startOf('month');
  const end = moment().subtract(1, 'month').startOf('month').add(14, 'days');
  const month = moment().month();
  const year = moment().year();
  const halfMonthId = `${half}_${month}_${year}`;
  return { start, end, half, halfMonthId };
};

export default getHalfMonthRange;
