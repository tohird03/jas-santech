import { ICurrency } from "../auth/types";
import { ISeller } from "../clients";
import { IPagination } from "../types";

export interface IGetStaffsPaymentsParams extends IPagination {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IStaffsPayments {
  id: string;
  description: string;
  createdAt: string;
  employee: ISeller;
  methods: {
    amount: number;
    currency: ICurrency;
  }[]
}

export interface IStaffPaymentsTotal {
  total: number;
  currency: ICurrency;
}

export interface IAddEditStaffsPayment {
  id?: string;
  method: {
    amount: number;
    currencyId: string;
  }
  description: string;
  employeeId: string;
}

export interface IAddEditStafPaymentForm {
  amount: number;
  currencyId: string;
  description: string;
  employeeId: string;
}
