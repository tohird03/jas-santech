import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IRole } from './types';
import { IPemissions } from '@/stores/profile/types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class RoleApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllRoles = (): Promise<IResponse<IRole[]>> =>
    this.get(Endpoints.role);

  getAllPermissions = (): Promise<IResponse<IPemissions[]>> =>
    this.get(Endpoints.PermissionsMany);
}

export const roleApi = new RoleApi(config);
