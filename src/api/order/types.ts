import { ICurrency } from '../auth/types';
import { IClientsInfo, ISeller } from '../clients';
import { IAddEditPaymentParams } from '../payment/types';
import { IProducts } from '../product/types';
import { IPagination, IPayment, IPaymentType } from '../types';

export interface IOrder {
  id: string;
  client: IClientsInfo;
  staff: ISeller;
  products: IOrderProducts[];
  status: IOrderStatus;
  date: string;
  articl: number;
  description: string;
  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  totalPayments: IOrderTotalPrice[];
  totalPrices: IOrderTotalPrice[];
  payment?: IAddEditPaymentParams;
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
      discount: number;
      currency: ICurrency;
    };
  };
  avarage_cost: number;
  product: IProducts;
  discount: number;
}

export interface IOrderProductUpdate {
  id: string;
  count: number;
  price: number;
  discount: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddOrderProducts {
  productId: string;
  count: number;
  price: number;
  discount: number;
  currencyId: string;
}

export interface IAddOrderModalForm extends IAddOrderProducts {
  clientId: string;
  date: string;
  description: string;
}

export interface IAddOrder {
  clientId: string;
  date: string;
  send: boolean;
  status?: IOrderStatus;
  products: IAddOrderProducts[];
  description?: string;
}

export interface IUpdateOrder {
  id: string;
  clientId?: string;
  date?: Date | string;
  status?: IOrderStatus;
  send: boolean;
  payment?: IOrderPayment;
  description?: string;
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
  discount: number;
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
