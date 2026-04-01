import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IGetStaffsPaymentsParams, IStaffsPayments } from '@/api/staffs-payments/types';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';

class StaffsPayments {
  #today = new Date();

  pageNumber = 1;
  pageSize = 20;
  search: string | null = null;
  isOpenAddEditStaffPaymentsModal = false;
  singleStaffPayments: IStaffsPayments | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;
  sellerId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getStaffsPayments = (params: IGetStaffsPaymentsParams) =>
    staffsPaymentsApi.getStaffsPayments(params)
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

  setIsOpenAddEditStaffPaymentsModal = (isOpenAddEditStaffPaymentsModal: boolean) => {
    this.isOpenAddEditStaffPaymentsModal = isOpenAddEditStaffPaymentsModal;
  };

  setSingleStaffPayments = (singleStaffPayments: IStaffsPayments | null) => {
    this.singleStaffPayments = singleStaffPayments;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  setSellerId = (sellerId: string | null) => {
    this.sellerId = sellerId;
  };

  reset = () => {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
    this.isOpenAddEditStaffPaymentsModal = false;
  };
}

export const staffsPaymentStore = new StaffsPayments();
