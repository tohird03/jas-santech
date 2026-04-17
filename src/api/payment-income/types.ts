import { IOrder } from "../order/types"
import { ISupplierInfo } from "../supplier/types";
import { IPagination, IPaymentType } from "../types"

export interface ISupplierPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  supplier: ISupplierInfo,
}

export interface IIncomeGetClientsPaymentsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface IAddEditPaymentParams {
  id?: string,
  supplierId: string,
  description: string;
  paymentMethods: IPaymentMethods[];
  changeMethods: IPaymentMethods[];
}

export interface IPaymentMethods {
  type: string,
  currencyId: string;
  amount: number;
}

export interface IAddEditPaymentForm {
  payments: IPaymentMethods[];
  supplierId: string;
  description: string;
  uzsChange: number;
  usdChange: number;
  uzsCash: number;
  usdCash: number;
}
