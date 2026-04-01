import { IClientsInfo, ISeller } from "../clients"
import { IOrder } from "../order/types"
import { IPagination, IPaymentType } from "../types"

export interface IClientsPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  user: IClientsInfo,
  staff: ISeller,
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
  orderId?: string,
  userId: string,
  cash: number,
  card: number,
  transfer: number,
  other: number,
  sendUser?: boolean,
}

export interface ITotalPayment {
  totalPay: number,
  totalCard: number,
  totalCash: number,
  totalTransfer: number,
  totalOther: number,
}
