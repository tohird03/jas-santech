import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditStaffsPayment, IGetStaffsPaymentsParams, IStaffsPayments } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class StaffsPayments extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getStaffsPayments = (params: IGetStaffsPaymentsParams): Promise<IResponse<IStaffsPayments[]>> =>
    this.get(Endpoints.StaffPaymentsMany, { params });

  addStaffsPayment = (params: IAddEditStaffsPayment): Promise<AxiosResponse> =>
    this.post(Endpoints.StaffPaymentsOne, params);

  updateStaffsPayment = (params: IAddEditStaffsPayment): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.StaffPaymentsOne}`, params, { params: { id: params?.id } });

  deleteStaffPayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.StaffPaymentsOne}`, { params: { id } });

  getAllUploadStaffPaymentExel = (params: IGetStaffsPaymentsParams): Promise<any> =>
    this.get(Endpoints.StaffPaymentExcel, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const staffsPaymentsApi = new StaffsPayments(config);
