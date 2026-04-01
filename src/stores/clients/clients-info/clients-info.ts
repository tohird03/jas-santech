import {makeAutoObservable} from 'mobx';
import {clientsInfoApi, IClientDebtFilter, IClientsInfo, IGetClientsInfoParams} from '@/api/clients';
import {addNotification} from '@/utils';

class ClientsInfoStore {
  pageNumber = 1;
  pageSize = 100;
  search: string | null = null;
  debt: number | null = null;
  debtType: IClientDebtFilter | null = null;
  isOpenAddEditClientModal = false;
  singleClientInfo: IClientsInfo | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getClients = (params: IGetClientsInfoParams) =>
    clientsInfoApi.getClientsInfo(params)
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

  setDebtType = (debtType: IClientDebtFilter | null) => {
    this.debtType = debtType;
  };

  setIsOpenAddEditClientModal = (isOpenAddEditClientModal: boolean) => {
    this.isOpenAddEditClientModal = isOpenAddEditClientModal;
  };

  setSingleClientInfo = (singleClientInfo: IClientsInfo | null) => {
    this.singleClientInfo = singleClientInfo;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 100;
    this.search = null;
  }
}

export const clientsInfoStore = new ClientsInfoStore();
