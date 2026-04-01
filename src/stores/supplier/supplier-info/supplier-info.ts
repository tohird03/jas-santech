import {makeAutoObservable} from 'mobx';
import {IClientDebtFilter} from '@/api/clients';
import {addNotification} from '@/utils';
import { supplierInfoApi } from '@/api/supplier/supplier';
import { IGetSupplierInfoParams, ISupplierDebtFilter, ISupplierInfo } from '@/api/supplier/types';

class SupplierInfoStore {
  pageNumber = 1;
  pageSize = 20;
  search: string | null = null;
  isOpenAddEditSupplierModal = false;
  singleSupplierInfo: ISupplierInfo | null = null;
  debt: number | null = null;
  debtType: ISupplierDebtFilter | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getSuppliers = (params: IGetSupplierInfoParams) =>
    supplierInfoApi.getSuppliersInfo(params)
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

  setDebt = (debt: number | null) => {
    this.debt = debt;
  };

  setDebtType = (debtType: ISupplierDebtFilter | null) => {
    this.debtType = debtType;
  };

  setIsOpenAddEditSupplierModal = (isOpenAddEditSupplierModal: boolean) => {
    this.isOpenAddEditSupplierModal = isOpenAddEditSupplierModal;
  };

  setSingleSupplierInfo = (singleSupplierInfo: ISupplierInfo | null) => {
    this.singleSupplierInfo = singleSupplierInfo;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const supplierInfoStore = new SupplierInfoStore();
