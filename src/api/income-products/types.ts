import { ICurrency } from "../auth/types";
import { IAddEditPaymentParams } from "../payment-income/types";
import { IProducts } from "../product/types"
import { IStaffs } from "../staffs";
import { ISupplierInfo } from "../supplier/types";
import { IPagination, IPayment, IPaymentType } from "../types";

export interface IIncomeOrder {
  id: string,
  accepted: boolean,
  supplier: ISupplierInfo,
  staff: IStaffs,
  products: IIncomeProduct[];
  createdAt: string;
  date: string;
  totalPayments: IIncomeOrderTotalPrice[];
  totalPrices: {
    cost: IIncomeOrderTotalPrice[];
    selling: IIncomeOrderTotalPrice[];
  };
  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  payment: IAddEditPaymentParams;
}

export interface IIncomeOrderTotalPrice {
  currencyId: string;
  total: number;
  currency: ICurrency;
}

export interface IIncomeProduct {
  id: string,
  count: number,
  prices: {
    selling: {
      price: number;
      totalPrice: number;
      currency: ICurrency;
    };
    cost: {
      price: number;
      totalPrice: number;
      currency: ICurrency;
    };
  },
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
  costCurrencyId: string;
  price: number;
  priceCurrencyId: string;
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
  payment?: IIncomeOrderPaymentParams;
}

export interface IUpdateIncomeProduct {
  id: string;
  count: number;
  price: number;
  cost: number;
  product: IProducts;
}

export interface IIncomeOrderPayment {
  supplier?: ISupplierInfo;
  orderId: string;
  payment: IAddEditPaymentParams | undefined;
}

export interface IIncomeOrderPaymentParams {
  description: string;
  paymentMethods: IPaymentMethods[];
  changeMethods: IPaymentMethods[];
}

export interface IPaymentMethods {
  type: string;
  currencyId: string;
  amount: number;
}

export interface IIncomeOrderPaymentForm {
  payments: IPaymentMethods[];
  description: string;
  uzsChange: number;
  usdChange: number;
  uzsCash: number;
  usdCash: number;
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
