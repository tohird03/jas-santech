import { ICurrency } from '../auth/types';

export interface IOrderStatistic {
  dailyByCurrency: IUserStatisticData[];
  weeklyByCurrency: IUserStatisticData[];
  monthlyByCurrency: IUserStatisticData[];
  yearlyByCurrency: IUserStatisticData[];
  clientDebtByCurrency: IUserDebtStatistic[];
  supplierDebtByCurrency: IUserDebtStatistic[];
}

export interface IUserStatisticData {
  total: number;
  currency: ICurrency;
}

export interface IUserDebtStatistic {
  ourDebt: number;
  theirDebt: number;
  currency: ICurrency;
}

export interface IOrderStatisticChart {
  date: string;
  sum: number;
}

export interface IOrderGraphStatistic {
  sums: {
    total: number;
    symbol: 'UZS' | 'USD';
  }[];
  date: string;
}

export enum IOrderGraphStatisticType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
