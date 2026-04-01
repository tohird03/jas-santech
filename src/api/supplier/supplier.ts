import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditSupplier, IGetSingleSupplierParams, IGetSupplierInfoParams, ISupplierInfo } from './types';
import { IGetClientDeedExcelParams } from '../clients';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class SupplierInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getSuppliersInfo = (params: IGetSupplierInfoParams): Promise<IResponse<ISupplierInfo[]>> =>
    this.get(Endpoints.SupplierMany, { params });

  addSuppliers = (params: IAddEditSupplier): Promise<AxiosResponse> =>
    this.post(Endpoints.SupplierOne, params);

  updateSupplier = (params: IAddEditSupplier): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SupplierOne}`, params, { params: { id: params?.id } });

  deleteSupplier = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SupplierOne}`, { params: { id } });

  getSingleSupplier = (params: IGetSingleSupplierParams): Promise<{ data: ISupplierInfo }> =>
    this.get(Endpoints.SupplierOne, { params });

  getUploadSupplier = (params: IGetSupplierInfoParams): Promise<any> =>
    this.get(Endpoints.UploadSupplier, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.SupplierDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadDeedToExelWithProducts = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.SupplierDeedProductsExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const supplierInfoApi = new SupplierInfoApi(config);
