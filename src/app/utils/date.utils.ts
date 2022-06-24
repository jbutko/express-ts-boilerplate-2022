import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import isDate from 'date-fns/isDate';
import parseISO from 'date-fns/parseISO';
import getWeekFns from 'date-fns/getWeek';

export const isoToDate = (date: string): Date => new Date(date);
export const dateToIso = (date: Date): string => new Date(date).toISOString();
export const getYear = (date = new Date()) => date.getFullYear();
export const getDay = (date = new Date()) => date.getDate();
export const getWeek = (date = new Date()) =>
  getWeekFns(date, {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });
export const getMonth = (date = new Date()) => date.getMonth() + 1;
export const getPaddedMonth = (date = new Date()) => {
  const month = getMonth(date);
  if (month < 10) return `0${getMonth(date)}`;
  return month;
};
export const getYearMonth = (date = new Date()) =>
  Number(`${getYear(date)}${getPaddedMonth(date)}`);

export const getDaysDiff = (dateSince: Date, dateTo: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const diff = Math.round(Math.abs((dateSince.getTime() - dateTo.getTime()) / oneDay));
  return diff;
};

export const getStartOfDate = (value: Date) => !!value && startOfDay(value);

export const getEndOfDate = (value: Date) => !!value && endOfDay(value);

export const checkIsISODate = (value: string) => !!value && isDate(parseISO(value));
