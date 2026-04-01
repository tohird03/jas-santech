import { IProducts } from "../product/types"
import { IStaffs } from "../staffs";
import { ISupplierInfo } from "../supplier/types";
import { IPagination, IPayment, IPaymentType } from "../types";

export interface IIncomeOrder {
  id: string,
  accepted: boolean,
  supplier: ISupplierInfo,
  staff: IStaffs,
  payment: IPayment;
  products: IIncomeProduct[];
  createdAt: string;
  date: string;
  totalPayment: number;
  totalCost: number;
  debt: number;
}

export interface IIncomeProduct {
  id: string,
  cost: number,
  count: number,
  price: number,
  wholesale_price: number,
  product: IProducts;
}

export interface IGetIncomeOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
}


export interface IAddIncomeOrderProducts {
  productId: string;
  count: number;
  cost: number;
  price: number;
}

export interface IAddIncomeOrderForm extends IAddIncomeOrderProducts {
  supplierId: string;
  date: string;
}

export interface IAddEditIncomeOrder {
  supplierId: string;
  products: IAddIncomeOrderProducts[];
  date: string;
}

export interface IUpdateIncomeOrder {
  id: string;
  supplierId?: string;
  date?: string;
  payment?: IPaymentType;
}

export interface IIncomeOrderPayment {
  supplier?: ISupplierInfo;
  orderId: string;
  payment: IPayment | undefined;
}

export interface IIncomeOrderProductAdd extends IAddIncomeOrderProducts {
  arrivalId: string;
}

export interface IIncomeUpdateOrderProduct {
  id: string;
  count: number;
  cost: number;
  price: number;
}


export interface ITotalIncomeOrderPaymentCalc {
  totalCost: number | null;
  totalPayment: number | null;
  totalCardPayment: number | null;
  totalCashPayment: number |null;
  totalOtherPayment: number | null;
  totalTransferPayment: number | null;
  totalDebt: number | null;
}
