import {makeAutoObservable} from 'mobx';
import {authApi} from '@/api';
import {ICurrency} from '@/api/auth/types';
import {addNotification} from '@/utils';

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
