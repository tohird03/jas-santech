import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { IIncomeGetClientsPaymentsParams, ISupplierPayments } from '@/api/payment-income/types';
import { incomePaymentApi } from '@/api/payment-income';

class SupplierPaymentsStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 20;
  search: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: ISupplierPayments | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getSupplierPayments = (params: IIncomeGetClientsPaymentsParams) =>
    incomePaymentApi.getIncomePayments(params)
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

  setIsOpenAddEditPaymentModal = (isOpenAddEditPaymentModal: boolean) => {
    this.isOpenAddEditPaymentModal = isOpenAddEditPaymentModal;
  };

  setSinglePayment = (singlePayment: ISupplierPayments | null) => {
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

export const supplierPaymentsStore = new SupplierPaymentsStore();
