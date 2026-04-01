import { IPagination } from '../types';

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
  debt: number;
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
  totalDebit: number;
  totalCredit: number;
  debt: number;
  deeds: ISupplierDeed[];
}

export interface ISupplierDeed {
  type: ISupplierDeedType;
  value: number;
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
