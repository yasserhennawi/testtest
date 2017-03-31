import moment from 'moment';
import { DEFAULT_LOCALE } from 'modules/locale/constants';

const getDate = (date) => date instanceof Date ? date : new Date(date);

const resetTime = (date) => new Date(getDate(date).setHours(0, 0, 0, 0));

export const formatDate = (date, format, locale) => {
  let myLocale = locale;
  if (!myLocale) myLocale = DEFAULT_LOCALE;
  const localLocale = moment(date);
  return localLocale.locale(myLocale).format(format);
};

export const isValidDate = (date) => moment(date).isValid();

export const isDateWithinRange = (date, fromDate, toDate) => {
  // appear item if no date value
  if (!date) return true;

  const mDate = resetTime(getDate(date));
  const mFromDate = resetTime(getDate(fromDate));
  const mToDate = resetTime(getDate(toDate));

  if (isSame(mDate, mFromDate) ||
      isSame(mDate, mToDate) ||
      (mDate > mFromDate && mDate < mToDate)) return true;

  return false;
};

export const isSame = (date1, date2) => moment(date1).isSame(date2);

export const getRangeDates = (fromDate, toDate) => {
  const dateArray = [];
  const fromD = getDate(fromDate);
  const toD = getDate(toDate);

  let currentDate = fromD;
  while (currentDate < toD) {
    dateArray.push(currentDate);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return dateArray;
};
