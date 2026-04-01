import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IAddOrder, IAddOrderProducts, IGetOrdersParams, IOrder, IOrderStatus } from '@/api/order/types';
import { ordersApi } from '@/api/order';
import dayjs from 'dayjs';
import { IOrderPayment } from './types';

class OrdersStore {
  #today = new Date();

  order: IOrder | null = null;
  orderPayment: IOrderPayment | null = null;
  pageNumber = 1;
  pageSize = 100;
  accepted: IOrderStatus | null = null;
  search: string | null = null;
  sellerId: string | null = null;
  isOpenAddEditNewOrderModal = false;
  isOpenShowOrderModal = false;
  isOpenPaymentModal = false;
  singleOrder: IOrder | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;
  isSendUser = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsSendUser = (isSendUser: boolean) => {
    this.isSendUser = isSendUser;
  };

  getOrders = (params: IGetOrdersParams) =>
    ordersApi.getOrders(params)
      .then(res => res)
      .catch(addNotification);

  getSingleOrder = (orderId: string) =>
    ordersApi.getSingleOrder(orderId)
      .then(res => {
        this.setOrder(res?.data);

        return res;
      })
      .catch(addNotification);

  setOrder = (order: IOrder | null) => {
    this.order = order;
  };

  setOrderPayment = (orderPayment: IOrderPayment | null) => {
    this.orderPayment = orderPayment;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setAccepted = (accepted: IOrderStatus | null) => {
    this.accepted = accepted;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setSellerId = (sellerId: string | null) => {
    this.sellerId = sellerId;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  setIsOpenAddEditNewOrderModal = (isOpenAddEditNewOrderModal: boolean) => {
    this.isOpenAddEditNewOrderModal = isOpenAddEditNewOrderModal;
  };

  setIsOpenShowOrderModal = (isOpenShowOrderModal: boolean) => {
    this.isOpenShowOrderModal = isOpenShowOrderModal;
  };

  setIsOpenPaymentModal = (isOpenPaymentModal: boolean) => {
    this.isOpenPaymentModal = isOpenPaymentModal;
  };

  setSingleOrder = (singleOrder: IOrder | null) => {
    this.singleOrder = singleOrder;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 100;
    this.search = null;
  }
}

export const ordersStore = new OrdersStore();
