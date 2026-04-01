import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditPaymentParams, IClientsPayments, IGetClientsPaymentsParams, ITotalPayment } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsPaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPayments = (params: IGetClientsPaymentsParams): Promise<IResponse<IClientsPayments[], ITotalPayment>> =>
    this.get(Endpoints.ClientsPaymentsMany, { params });

  addPayment = (params: IAddEditPaymentParams): Promise<AxiosResponse> =>
    this.post(Endpoints.ClientsPaymentsOne, params);

  updatePayment = (params: IAddEditPaymentParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.ClientsPaymentsOne}`, params, { params: { id: params?.id } });

  deletePayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.ClientsPaymentsOne}`, {params: {id}});

  getUploadPayments = (params: IGetClientsPaymentsParams): Promise<any> =>
    this.get(Endpoints.ClientPaymentExcel, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const clientsPaymentApi = new ClientsPaymentApi(config);
