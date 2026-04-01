import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IAddIncomeOrderProducts, IGetIncomeOrdersParams, IIncomeOrder, IIncomeOrderPayment } from '@/api/income-products/types';
import { incomeProductsApi } from '@/api/income-products';
import { IOrderPayment } from '../orders-list/types';

class IncomeProductsStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;
  isOpenAddEditIncomeProductsModal = false;
  isOpenShowIncomeOrderModal = false;
  singleIncomeOrder: IIncomeOrder | null = null;
  incomeOrder: IIncomeOrder | null = null;
  incomeOrderPayment: IIncomeOrderPayment | null = null;
  isOpenIncomeOrderPaymentModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  getIncomeOrders = (params: IGetIncomeOrdersParams) =>
    incomeProductsApi.getIncomeOrder(params)
      .then(res => res)
      .catch(addNotification);

  getSingleIncomeOrder = (orderId: string) =>
    incomeProductsApi.getSingleIncomeOrder(orderId)
      .then(res => {
        this.setIncomeOrder(res?.data);

        return res;
      })
      .catch(addNotification);

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  setIsOpenAddEditIncomeProductsModal = (isOpenAddEditIncomeProductsModal: boolean) => {
    this.isOpenAddEditIncomeProductsModal = isOpenAddEditIncomeProductsModal;
  };

  setIsOpenShowIncomeOrderModal = (isOpenShowIncomeOrderModal: boolean) => {
    this.isOpenShowIncomeOrderModal = isOpenShowIncomeOrderModal;
  };

  setsingleIncomeOrder = (singleIncomeOrder: IIncomeOrder | null) => {
    this.singleIncomeOrder = singleIncomeOrder;
  };

  setIncomeOrder = (order: IIncomeOrder | null) => {
    this.incomeOrder = order;
  };

  setIncomeOrderPayment = (incomeOrderPayment: IIncomeOrderPayment | null) => {
    this.incomeOrderPayment = incomeOrderPayment;
  };

  setIsOpenIncomePaymentModal = (isOpenIncomeOrderPaymentModal: boolean) => {
    this.isOpenIncomeOrderPaymentModal = isOpenIncomeOrderPaymentModal;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const incomeProductsStore = new IncomeProductsStore();
