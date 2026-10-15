import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditWarehouse, IProductWarehouse } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class WarehouseApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getWarehouses = (): Promise<IResponse<IProductWarehouse[]>> =>
    this.get(Endpoints.WarehouseMany, { params: {pagination: false} });

  addWarehouse = (params: IAddEditWarehouse): Promise<AxiosResponse> =>
    this.post(Endpoints.WarehouseOne, params);

  updateWarehouse = (params: IAddEditWarehouse): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WarehouseOne}`, params, { params: { id: params?.id } });

  // deletePayment = (id: string): Promise<AxiosResponse> =>
  //   this.delete(`${Endpoints.ClientsPaymentsOne}`, {params: {id}});

  // getUploadPayments = (params: IGetClientsPaymentsParams): Promise<any> =>
  //   this.get(Endpoints.ClientPaymentExcel, {
  //     params,
  //     responseType: 'arraybuffer',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/xlsx',
  //     },
  //   });
}

export const warehouseApi = new WarehouseApi(config);
