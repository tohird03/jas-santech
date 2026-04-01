import {makeAutoObservable} from 'mobx';
import {IGetStaffsParams, IStaffs, staffsApi} from '@/api/staffs';
import {addNotification} from '@/utils';

class Staffs {
  pageNumber = 1;
  pageSize = 20;
  search: string | null = null;
  isOpenAddEditStaffModal = false;
  singleStaff: IStaffs | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getStaffs = (params: IGetStaffsParams) =>
    staffsApi.getStaffs(params)
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

  setIsOpenAddEditStaffModal = (isOpenAddEditStaffModal: boolean) => {
    this.isOpenAddEditStaffModal = isOpenAddEditStaffModal;
  };

  setSingleStaff = (singleStaff: IStaffs | null) => {
    this.singleStaff = singleStaff;
  };

  reset = () => {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
    this.isOpenAddEditStaffModal = false;
  };
}

export const staffsStore = new Staffs();
