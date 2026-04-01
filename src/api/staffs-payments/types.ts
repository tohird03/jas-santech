import { ISeller } from "../clients";
import { IPagination } from "../types";

export interface IGetStaffsPaymentsParams extends IPagination {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IStaffsPayments {
  id: string;
  sum: string;
  description: string;
  createdAt: string;
  user: ISeller;
}

export interface IAddEditStaffsPayment {
  id?: string;
  sum: number;
  description: string;
  userId: string
}
