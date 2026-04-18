import { ICurrency } from '../auth/types';
import { IClientsInfo, ISeller } from '../clients';
import { IProducts } from '../product/types';
import { IPagination, IPayment, IPaymentType } from '../types';

export interface IOrder {
  id: string;
  client: IClientsInfo;
  staff: ISeller;
  payment: IPayment;
  products: IOrderProducts[];
  status: IOrderStatus;
  date: string;
  articl: number;

  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  totalPayments: IOrderTotalPrice[];
  totalPrices: IOrderTotalPrice[];
}

export interface IOrderTotalPrice {
  currencyId: string;
  total: number;
  currency: ICurrency;
}

export enum IOrderStatus {
  ACCEPTED = 'accepted',
  NOTACCEPTED = 'notaccepted',
}

export interface IGetOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  status?: IOrderStatus;
  staffId?: string;
  type?: 'excel';
}

export interface IOrderProducts {
  id: string;
  count: number;
  prices: {
    selling: {
      price: number;
      totalPrice: number;
      currency: ICurrency;
    };
  };
  avarage_cost: number;
  product: IProducts;
}

export interface IOrderProductUpdate {
  id: string;
  count: number;
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddOrderProducts {
  productId: string;
  count: number;
  price: number;
  currencyId: string;
}

export interface IAddOrderModalForm extends IAddOrderProducts {
  clientId: string;
  date: string;
}

export interface IAddOrder {
  clientId: string;
  date: string;
  send: boolean;
  status?: IOrderStatus;
  products: IAddOrderProducts[];
}

export interface IUpdateOrder {
  id: string;
  clientId?: string;
  date?: Date | string;
  status?: IOrderStatus;
  send: boolean;
  payment?: IOrderPayment;
}

export interface IOrderPayment {
  description: string;
  paymentMethods: IPaymentMethods[];
  changeMethods: IPaymentMethods[];
}

export interface IPaymentMethods {
  type: string;
  currencyId: string;
  amount: number;
}

export interface IAddEditPaymentForm {
  payments: IPaymentMethods[];
  description: string;
  uzsChange: number;
  usdChange: number;
  uzsCash: number;
  usdCash: number;
}

export interface IUploadOrderToExelParams extends IGetOrdersParams {
  orderId: string;
}

export interface IOrderProductAdd extends IAddOrderProducts {
  sellingId: string;
}

export interface IUpdateOrderProduct {
  id: string;
  count: number;
  price: number;
}

export interface ITotalOrderPaymentCalc {
  totalPrice: number | null;
  totalPayment: number | null;
  totalCardPayment: number | null;
  totalCashPayment: number | null;
  totalOtherPayment: number | null;
  totalTransferPayment: number | null;
  totalDebt: number | null;
}
