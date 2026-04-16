import { ICurrency } from "../auth/types";
import { IClientsInfo, ISeller } from "../clients"
import { IOrder } from "../order/types"
import { IPagination, IPaymentType } from "../types"

export interface IClientsPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  client: IClientsInfo,
  staff: ISeller,
  description: string;
  paymentMethods: IPaymentMethodsGet[];
}

export interface IPaymentMethodsGet {
  type: 'cash' | 'balance',
  currency: ICurrency;
  amount: number;
}

export interface IGetClientsPaymentsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  staffId?: string;
}

export interface IAddEditPaymentParams {
  id?: string,
  clientId: string,
  description: string;
  paymentMethods: IPaymentMethods[];
}

export interface IPaymentMethods {
  type: string,
  currencyId: string;
  amount: number;
}

export interface IAddEditPaymentForm {
  paymentMethods: IPaymentMethods[];
  clientId: string;
  description: string;
}

export interface ITotalPayment {
  totalPay: number,
  totalCard: number,
  totalCash: number,
  totalTransfer: number,
  totalOther: number,
}
