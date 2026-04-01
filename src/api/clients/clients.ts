import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddEditClientInfo,
  IClientStatistic,
  IClientsInfo,
  IGetClientDeedExcelParams,
  IGetClientsInfoParams,
  IGetClientsStatisticParams,
  IGetSingleClientParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
    this.get(Endpoints.ClientsMany, { params });

  addClients = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.ClientOne, params);

  updateClient = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.ClientOne}`, params, { params: { id: params?.id } });

  deleteClient = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.ClientOne}`, { params: { id } });

  getSingleClient = (params: IGetSingleClientParams): Promise<{ data: IClientsInfo }> =>
    this.get(Endpoints.ClientOne, { params });

  getClientsStatistic = (params: IGetClientsStatisticParams): Promise<IResponse<IClientStatistic[]>> =>
    this.get(Endpoints.ClientsStatistic, { params: {...params, debtType: 'gt'} });

  getUploadClients = (params: IGetClientsInfoParams): Promise<any> =>
    this.get(Endpoints.UploadClient, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.ClientDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadDeedToExelWithProducts = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.ClientDeedProductsExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const clientsInfoApi = new ClientsInfoApi(config);
