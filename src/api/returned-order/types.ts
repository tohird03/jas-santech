import { ICurrency } from "../auth/types";
import { IClientsInfo, ISeller } from "../clients";
import { IOrderPayment, IOrderStatus } from "../order/types";
import { IProducts } from "../product/types";
import { IPagination, IPayment } from "../types";

export interface IGetReturnedOrdersParams extends IPagination {
  search?: string;
  accepted?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IReturnedOrder {
  id: string,
  description: string,
  status: IOrderStatus,
  createdAt: string,
  date: string,
  client: IClientsInfo,
  returnedDate: string,
  staff: ISeller,
  products: IReturnedOrderProducts[],
  totalPrices: IReturnedOrderTotalPrice[];
  debtByCurrency: {
    amount: number;
    currency: ICurrency;
  }[];
  totalPayments: IReturnedOrderPaymentGet[];
  payment: IReturnedOrderPaymentParams;
}

export interface IReturnedOrderPaymentGet {
  currencyId: string;
  total: number;
  currency: ICurrency;
}

export interface IReturnedOrderTotalPrice {
  currencyId: string;
  total: number;
  currency: ICurrency;
}

export interface IReturnedOrderProducts {
  id: string,
  cost: number;
  count: number,
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddReturnedOrders {
  clientId: string,
  date: string,
  description?: string,
  products: IAddReturnedOrderProducts[];
}

export interface IAddReturnedOrderProducts {
  productId: string;
  count: number;
  price: number;
  currencyId: string;
}

export interface IAddProductsToReturnedOrder extends IAddReturnedOrderProducts {
  returningId?: string;
}

export interface IUpdateReturnedOrder {
  id: string,
  clientId?: string,
  description?: string,
  payment?: IReturnedOrderPaymentParams;
}

export interface IReturnedOrderPaymentParams {
  description: string;
  paymentMethods: IPaymentMethods[];
  changeMethods: IPaymentMethods[];
}

export interface IPaymentMethods {
  type: string;
  currencyId: string;
  amount: number;
}

export interface IEditReturnedPaymentForm {
  payments: IPaymentMethods[];
  description: string;
  uzsChange: number;
  usdChange: number;
  uzsCash: number;
  usdCash: number;
}

export interface IUpdateProductFromReturnedOrders {
  id: string,
  price: number,
  count: number,
}

export interface IReturnedOrderPayment {
  client?: IClientsInfo;
  orderId: string;
  payment: IPayment | undefined;
}
