import { IOrder } from "../order/types"
import { ISupplierInfo } from "../supplier/types";
import { IPagination, IPaymentType } from "../types"

export interface ISupplierPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  user: ISupplierInfo,
}

export interface IIncomeGetClientsPaymentsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface IIncomeAddEditPaymentParams extends IPaymentType {
  id?: string,
  orderId?: string,
  supplierId: string,
}
