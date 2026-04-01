import { IClientsInfo, ISeller } from "../clients";
import { IOrderStatus } from "../order/types";
import { IProducts } from "../product/types";
import { IPagination } from "../types";

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
  totalPrice: number;
  payment: IReturnedOrderPayments;
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
  productId: string,
  count: number,
  price: number
}

export interface IAddProductsToReturnedOrder extends IAddReturnedOrderProducts {
  returningId?: string;
}

export interface IUpdateReturnedOrder {
  id: string,
  clientId?: string,
  description?: string,
  payment?: IReturnedOrderPayments,
}

export interface IUpdateProductFromReturnedOrders {
  id: string,
  price: number,
  count: number,
}

export interface IReturnedOrderPayments {
  cash?: number,
  fromBalance?: number,
}
