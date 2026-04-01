import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IIncomeAddEditPaymentParams, IIncomeGetClientsPaymentsParams, ISupplierPayments } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class IncomePaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomePayments = (params: IIncomeGetClientsPaymentsParams): Promise<IResponse<ISupplierPayments[]>> =>
    this.get(Endpoints.SupplierPaymentsMany, { params });

  addIncomePayment = (params: IIncomeAddEditPaymentParams): Promise<AxiosResponse> =>
    this.post(Endpoints.SupplierPaymentsOne, params);

  updateIncomePayment = (params: IIncomeAddEditPaymentParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SupplierPaymentsOne}`, params, { params: { id: params?.id } });

  deleteIncomePayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SupplierPaymentsOne}`, { params: { id } });

  getUploadPayments = (params: IIncomeGetClientsPaymentsParams): Promise<any> =>
    this.get(Endpoints.SupplierPaymentsExcel, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const incomePaymentApi = new IncomePaymentApi(config);
