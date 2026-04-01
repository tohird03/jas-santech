export interface IOrderStatistic {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  client: IUserDebtStatistic;
  supplier: IUserDebtStatistic;

  weeklyChart: IOrderStatisticChart[];
}

export interface IUserDebtStatistic {
  ourDebt: number;
  theirDebt: number;
}

export interface IOrderStatisticChart {
  date: string;
  sum: number;
}

export interface IOrderGraphStatistic {
  sum: number;
  date: string;
}

export enum IOrderGraphStatisticType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
