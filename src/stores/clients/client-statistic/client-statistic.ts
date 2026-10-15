import { makeAutoObservable } from 'mobx';
import { IGetStaffsParams, IStaffs, staffsApi } from '@/api/staffs';
import { addNotification } from '@/utils';
import { IGetClientsStatisticParams, clientsInfoApi } from '@/api/clients';

class ClientsStatisticStore {
  #today = new Date();

  search: string | null = null;
  pageNumber = 1;
  pageSize = 5000;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getClientsStatistic = (params: IGetClientsStatisticParams) =>
    clientsInfoApi.getClientsStatistic(params)
      .then(res => res)
      .catch(addNotification);

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  reset = () => {
    this.pageNumber = 1;
    this.pageSize = 50;
  };
}

export const clientsStatisticStore = new ClientsStatisticStore();
