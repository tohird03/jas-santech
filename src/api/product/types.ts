import { IStaff } from "@/stores/profile/types";
import { IPagination } from "../types";
import { IOrder } from "../order/types";
import { IIncomeOrder } from "../income-products/types";
import { IReturnedOrder } from "../returned-order/types";
import { ICurrency } from "../auth/types";

export interface IGetProductsParams extends IPagination {
  search?: string;
  clientId?: string;
}


export interface IProducts {
  id: string;
  name: string;
  count: number;
  minAmount: number;
  createdAt: string;
  prices: {
    cost: IProductPrice,
    selling: IProductPrice,
    wholesale: IProductPrice,
  };
  image: string,
  lastSellingDate: string;
  description: string;
  lastSelling: {
    date: string,
    price: number,
    count: number,
  }
}

export interface IProductPrice {
  id: string,
  type: "cost" | "selling" | "wholesale",
  price: number,
  totalPrice: number,
  currency: ICurrency,
  exchangeRate: number,
}

export interface IAddEditProduct {
  id?: string,
  name: string,
  count: number,
  minAmount: number,
  description: string,
  image: any,
  prices_cost_price: number;
  prices_cost_currencyId: string;
  prices_selling_price: number;
  prices_selling_currencyId: string;
  prices_wholesale_price: number;
  prices_wholesale_currencyId: string;
}

export interface IAddEditProductForm {
  name: string,
  count: number,
  minAmount: number,
  description: string,
  cost: number,
  costCurrency: string,
  price: number,
  priceCurrency: string,
  wholesale: number;
  wholesaleCurrency: string;
}

export interface IProductTotalCalc {
  calcPage: {
    totalPrice: number,
    totalCost: number,
    totalCount: number,
  },
  calcTotal: {
    totalPrice: number,
    totalCost: number,
    totalWholesale: number,
    totalCount: number,
  }
}

export interface IGetSingleProductParams {
  productId: string;
  startDate: Date;
  endDate: Date
}

export interface IGetSingleProducts {
  products: ISingleProductStory[];
  actualCount: number,
  totalSellingCount: number,
  totalArrivalCount: number,
  totalReturningCount: number,
}

export interface ISingleProductStory {
  count: number;
  type: 'selling' | 'arrival' | 'returning';
  product?: IProducts;
  staff?: IStaff;
  id: string;
  selling: IOrder;
  arrival: IIncomeOrder;
  returning: IReturnedOrder;
  createdAt: string;
}
