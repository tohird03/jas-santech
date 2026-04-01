import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { ISingleSupplierTabs } from './types';
import { IClientsPayments, IGetClientsPaymentsParams } from '@/api/payment/types';
import { clientsPaymentApi } from '@/api/payment/payment';
import { supplierInfoApi } from '@/api/supplier/supplier';
import { IGetSingleSupplierParams, ISupplierInfo } from '@/api/supplier/types';

class SingleSupplierStore {
  activeSupplier: ISupplierInfo | null = null;
  activeTabs: ISingleSupplierTabs = ISingleSupplierTabs.ORDER;
  #today = new Date();

  // PAYMENTS
  paymentPage = 1;
  paymentPageSize = 20;
  paymentSearch: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: IClientsPayments | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getSingleSupplier = (params: IGetSingleSupplierParams) =>
    supplierInfoApi.getSingleSupplier(params)
      .then(res => {
        if (res) {
          this.setActiveSupplier(res?.data);

          return res;
        }
      })
      .catch(addNotification);

  setActiveSupplier = (activeSupplier: ISupplierInfo | null) => {
    this.activeSupplier = activeSupplier;
  };

  setActiveTabs = (activeTabs: ISingleSupplierTabs) => {
    this.activeTabs = activeTabs;
  };

  // PAYMENTS
  getSingleClientsPayments = (params: IGetClientsPaymentsParams) =>
    clientsPaymentApi.getPayments(params)
      .then(res => res)
      .catch(addNotification);

  setPaymentPage = (paymentPage: number) => {
    this.paymentPage = paymentPage;
  };

  setPaymentPageSize = (paymentPageSize: number) => {
    this.paymentPageSize = paymentPageSize;
  };

  setPaymentSearch = (paymentSearch: string | null) => {
    this.paymentSearch = paymentSearch;
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
    this.activeSupplier = null;
    this.activeTabs = ISingleSupplierTabs.ORDER;
  }
}

export const singleSupplierStore = new SingleSupplierStore();
