import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IGetReturnedOrdersParams, IReturnedOrder, IReturnedOrderPayments } from '@/api/returned-order/types';
import { returnedOrderApi } from '@/api/returned-order/returned-order';

class ReturnedOrdersStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 10;
  accepted: string | null = null;
  search: string | null = null;
  singleReturnedOrder: IReturnedOrder | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;
  isOpenAddEditReturnedOrderModal = false;
  isOpenPaymentModal = false;
  isOpenShowProductModal = false;
  singlePayment: IReturnedOrderPayments | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getReturnedOrders = (params: IGetReturnedOrdersParams) =>
    returnedOrderApi.getReturnedOrders(params)
      .then(res => res)
      .catch(addNotification);

  getSingleOrder = (orderId: string) =>
    returnedOrderApi.getSingleReturnedOrder(orderId)
      .then(res => {
        this.setSingleReturnedOrder(res?.data);

        return res;
      })
      .catch(addNotification);

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setAccepted = (accepted: string | null) => {
    this.accepted = accepted;
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

  setSingleReturnedOrder = (singleReturnedOrder: IReturnedOrder | null) => {
    this.singleReturnedOrder = singleReturnedOrder;
  };

  setIsOpenAddEditReturnedOrderModal = (isOpenAddEditReturnedOrderModal: boolean) => {
    this.isOpenAddEditReturnedOrderModal = isOpenAddEditReturnedOrderModal;
  };

  setIsOpenPaymentModal = (isOpenPaymentModal: boolean) => {
    this.isOpenPaymentModal = isOpenPaymentModal;
  };

  setSinglePayment = (singlePayment: IReturnedOrderPayments | null) => {
    this.singlePayment = singlePayment;
  };

  setIsOpenShowEditModal = (isOpenShowProductModal: boolean) => {
    this.isOpenShowProductModal = isOpenShowProductModal;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const returnedOrdersStore = new ReturnedOrdersStore();
