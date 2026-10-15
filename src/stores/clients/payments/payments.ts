import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { IClientsPayments, IGetClientsPaymentsParams } from '@/api/payment/types';
import { clientsPaymentApi } from '@/api/payment';

class PaymentsStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  sellerId: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: IClientsPayments | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getClientsPayments = (params: IGetClientsPaymentsParams) =>
    clientsPaymentApi.getPayments(params)
      .then(res => res)
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

  setSellerId = (sellerId: string | null) => {
    this.sellerId = sellerId;
  };

  setIsOpenAddEditPaymentModal = (isOpenAddEditPaymentModal: boolean) => {
    this.isOpenAddEditPaymentModal = isOpenAddEditPaymentModal;
  };

  setSinglePayment = (singlePayment: IClientsPayments | null) => {
    this.singlePayment = singlePayment;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const paymentsStore = new PaymentsStore();
