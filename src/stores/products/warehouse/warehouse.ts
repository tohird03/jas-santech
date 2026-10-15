import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { authApi } from '@/api';
import { ICurrency } from '@/api/auth/types';
import { warehouseApi } from '@/api/warehouse';
import { IProductWarehouse } from '@/api/warehouse/types';

class Warehouse {
  isOpenAddEditCurrency = false;
  singleWarehouse: IProductWarehouse | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getWarehouses = () =>
    warehouseApi.getWarehouses()
      .then(res => res)
      .catch(addNotification);

  setIsOpenAddEditWarehouseModal = (isOpenEditCurrency: boolean) => {
    this.isOpenAddEditCurrency = isOpenEditCurrency;
  };

  setSingleWarehouse = (singleWarehouse: IProductWarehouse | null) => {
    this.singleWarehouse = singleWarehouse;
  };

  reset = () => {
    this.isOpenAddEditCurrency = false;
  };
}

export const warehouseStore = new Warehouse();
