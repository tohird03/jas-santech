import dayjs from 'dayjs';

export const getDateFormat = (date: string | any) => {
  if (!date) return '-';

  return dayjs(date).format('YYYY-MM-DD');
};

export enum DateTypes {
  Date = 'date',
  Time = 'time',
}

export function checkHalfHourSegment(date1: string | undefined, time1: string, date2: string, time2: string): boolean {
  const datetime1 = `${date1} ${time1}`;
  const datetime2 = `${date2} ${time2}`;
  const dt1 = new Date(datetime1);
  const dt2 = new Date(datetime2);
  const diffMinutes = Math.abs((dt1.getTime() - dt2.getTime()) / (1000 * 60));

  return diffMinutes <= 30;
}

export function measureDate(dateType: DateTypes) {
  if (dateType === DateTypes.Date) {
    return dayjs(new Date()).format('YYYY-MM-DD');
  } else if (dateType === DateTypes.Time) {
    return dayjs(new Date()).format('HH:mm:ss');
  }
}

export const getFullFormatOfDate = (date: string) => {
  if (!date) return '-';

  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};
