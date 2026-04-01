import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddStaff, IGetStaffsParams, IStaffs, IUpdateStaff } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class StaffsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getStaffs = (params: IGetStaffsParams): Promise<IResponse<IStaffs[]>> =>
    this.get(Endpoints.StaffsMany, { params });

  addNewStaff = (params: IAddStaff): Promise<AxiosResponse> =>
    this.post(Endpoints.StaffOne, params);

  updateStaff = (params: IUpdateStaff): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.StaffOne}`, params, { params: { id: params?.id } });

  deleteStaff = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.StaffOne}`, { params: { id } });

  getSingleStaffs = (staffId: string): Promise<{ data: IStaffs }> =>
    this.get(Endpoints.StaffOne, { params: { id: staffId } });
}

export const staffsApi = new StaffsApi(config);
