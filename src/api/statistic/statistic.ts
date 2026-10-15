import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import {
  IOrderGraphStatistic,
  IOrderGraphStatisticType,
  IOrderStatistic,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class StatisticApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrdersStatistic = (): Promise<{data: IOrderStatistic}> =>
    this.get(Endpoints.OrderStatistic);

  getOrdersGraphStatistic = (type: IOrderGraphStatisticType): Promise<{data: IOrderGraphStatistic[]}> =>
    this.get(Endpoints.OrderGraphStatistic, {params: {type}});
}

export const statisticApi = new StatisticApi(config);
