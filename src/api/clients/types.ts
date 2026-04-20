import { ICurrency } from '../auth/types';
import { IPagination, IPayment } from '../types';

export interface IClientDebtByCurrency {
  amount: number;
  currency: ICurrency;
}

// CLIENT
export interface IClientsInfo {
  id: string;
  fullname: string;
  phone: string;
  debtByCurrency: IClientDebtByCurrency[];
  lastSellingDate: string;
  deedInfo: IClientDeedInfo;
  telegram?: {
    isActive: boolean;
  };
}

export interface IGetSingleClientParams {
  deedStartDate?: Date;
  deedEndDate?: Date;
  id: string;
}

export interface IClientDeedInfo {
  totalCreditByCurrency: IClientDebtByCurrency[];
  totalDebitByCurrency: IClientDebtByCurrency[];
  debtByCurrency: IClientDebtByCurrency[];
  deeds: IClientDeed[];
}

export interface IClientDeed {
  type: IClientDeedType;
  value: number;
  date: string;
  description: string;
  action: IClientDeedAction;
}

export enum IClientDeedType {
  DEBIT = 'debit',
  KREDIT = 'credit',
}

export enum IClientDeedAction {
  SELLING = 'selling',
  RETURNING = 'returning',
  PAYMENT = 'payment',
}

export interface IUpdateUser {
  id: string;
  fullname: string;
  phone: string;
}

// THIS SELLER USER
export interface ISeller {
  id: string;
  fullname: string;
  phone: string;
}

export interface IGetClientsInfoParams extends IPagination {
  search?: string;
  debtValue?: number;
  debtType?: IClientDebtFilter;
}

export enum IClientDebtFilter {
  EQUAL = 'eq',
  GREATER = 'gt',
  LESS = 'lt',
}

export interface IAddEditClientInfo {
  id?: string;
  fullname: string;
  phone: string;
}

export interface IGetClientDeedExcelParams {
  id: string;
  deedStartDate?: Date;
  deedEndDate?: Date;
}

export interface IGetClientsStatisticParams extends IPagination{
  startDate?: Date;
  endDate?: Date;
  search?: string;
  debtType?: 'gt' | 'lt' | 'eq';
}

export interface IClientStatistic {
  id: string;
  fullname: string;
  address: string;
  phone: string;
  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  deedInfo: IClientDeedInfo;
  lastSellingDate: string;
  calc: {
    selling: {
      count: number;
      totalPrice: number;
      payment: {
        count: number;
        total: number;
        totalCard: number;
        totalCash: number;
        totalTransfer: number;
        totalOther: number;
      };
    };
    returning: {
      count: number;
      totalPrice: number;
      payment: {
        totalFromBalance: number;
        totalCash: number;
      };
    };
  };
}
