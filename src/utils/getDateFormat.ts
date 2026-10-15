import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const DATE_FORMAT = 'DD.MM.YYYY';
const FULL_DATE_FORMAT = `${DATE_FORMAT} HH:mm`;


export const getDateFormat = (date: string) => dayjs(date).format();

export const dateFormat = (date: string) => dayjs(date).format(DATE_FORMAT);

export const getFullDateFormat = (date: string) => dayjs(date).format(FULL_DATE_FORMAT);

export const getTimeZoneDate = (date: string, hour: number) => dayjs(date).add(hour, 'hours').format(FULL_DATE_FORMAT);

// Extend Day.js with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone for Day.js (optional if setting timezone explicitly on conversion)
// dayjs.tz.setDefault("Asia/Tashkent");

// Convert UTC timestamp to Asia/Tashkent timezone
export const getTimeZoneDateWithTz = (date: string) => dayjs(date).tz('Asia/Tashkent').toISOString();

export const getStartAndEndDate = (startDateCount: number) => {
  const today = new Date();
  const oneWeekAgo = new Date();

  oneWeekAgo.setDate(today.getDate() - startDateCount);

  const startDate = new Date(oneWeekAgo);
  const endDate = today;

  return { startDate, endDate };
};

export const getStartMonthEndDate = () => {
  const today = new Date();

  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;

  return { startDate, endDate };
};
