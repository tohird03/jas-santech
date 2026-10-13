import {makeAutoObservable} from 'mobx';
import {statisticApi} from '@/api/statistic/statistic';
import {IOrderGraphStatisticType} from '@/api/statistic/types';
import {addNotification} from '@/utils';

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
    return undefined;
  }
}

export const homeStore = new HomeStore();
