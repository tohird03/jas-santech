import { ICurrency } from '../auth/types';
import { IPagination } from '../types';

export interface ISupplierDebtByCurrency {
  amount: number;
  currency: ICurrency;
}

export interface IGetSupplierInfoParams extends IPagination {
  search?: string;
  debtValue?: number;
  debtType?: ISupplierDebtFilter;
}

export enum ISupplierDebtFilter {
  EQUAL = 'eq',
  GREATER = 'gt',
  LESS = 'lt',
}

export interface ISupplierInfo {
  id: string;
  fullname: string;
  phone: string;
  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  lastArrivalDate: string;
  deedInfo: ISupplierDeedInfo;
}

export interface IGetSingleSupplierParams {
  id: string;
  deedStartDate?: Date;
  deedEndDate?: Date;
}

export interface IAddEditSupplier {
  id?: string;
  fullname: string;
  phone: string;
}

export interface ISupplierDeedInfo {
  totalCreditByCurrency: ISupplierDebtByCurrency[];
  totalDebitByCurrency: ISupplierDebtByCurrency[];
  debtByCurrency: ISupplierDebtByCurrency[];
  deeds: ISupplierDeed[];
}

export interface ISupplierDeed {
  type: ISupplierDeedType;
  values: {
    amount: number;
    currency: ICurrency;
  }[];
  date: string;
  description: string;
  action: ISupplierDeedAction;
}

export enum ISupplierDeedType {
  DEBIT = 'debit',
  KREDIT = 'credit',
}

export enum ISupplierDeedAction {
  PAYMENT = 'payment',
  ARRIVAL = 'arrival',
}
