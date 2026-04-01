import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const FULL_DATE_FORMAT = `${DATE_FORMAT} HH:MM`;


export const getDateFormat = (date: string) => dayjs(date).format();

export const getFullDateFormat = (date: string) => dayjs(date).format(FULL_DATE_FORMAT);
