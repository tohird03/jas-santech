import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IGetStaffsPaymentsParams, IStaffsPayments } from '@/api/staffs-payments/types';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';
import { authApi } from '@/api';
import { ICurrency } from '@/api/auth/types';

class CurrencyStore {
  isOpenEditCurrency = false;
  singleCurrency: ICurrency | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getCurrency = () =>
    authApi.getCurrencyMany()
      .then(res => res)
      .catch(addNotification);

  setIsOpenEditCurrencyModal = (isOpenEditCurrency: boolean) => {
    this.isOpenEditCurrency = isOpenEditCurrency;
  };

  setSingleCurrency = (singleCurrency: ICurrency | null) => {
    this.singleCurrency = singleCurrency;
  };

  reset = () => {
    this.isOpenEditCurrency = false;
  };
}

export const currencyStore = new CurrencyStore();
