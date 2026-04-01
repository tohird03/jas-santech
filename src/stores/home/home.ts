import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { statisticApi } from '@/api/statistic/statistic';
import { IOrderGraphStatisticType } from '@/api/statistic/types';

class HomeStore {
  constructor() {
    makeAutoObservable(this);
  }

  getOrdersStatistic = () =>
    statisticApi.getOrdersStatistic()
      .then(res => res?.data)
      .catch(addNotification);

  getOrdersGraphStatistic = (params: IOrderGraphStatisticType) =>
    statisticApi.getOrdersGraphStatistic(params)
      .then(res => res?.data)
      .catch(addNotification);

  reset() {
  }
}

export const homeStore = new HomeStore();
