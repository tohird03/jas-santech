import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditIncomeOrder, IGetIncomeOrdersParams, IIncomeOrder, IIncomeOrderProductAdd, IIncomeUpdateOrderProduct, IUpdateIncomeOrder } from './types';
import { IUpdateOrder } from '../order/types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class IncomeProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomeOrder = (params: IGetIncomeOrdersParams): Promise<IResponse<IIncomeOrder[]>> =>
    this.get(Endpoints.IncomeMany, { params });

  addNewIncomeOrder = (params: IAddEditIncomeOrder): Promise<{ data: IIncomeOrder }> =>
    this.resPost(Endpoints.IncomeOne, params);

  getSingleIncomeOrder = (orderId: string): Promise<{ data: IIncomeOrder }> =>
    this.get(Endpoints.IncomeOne, { params: { id: orderId } });

  updateIncomeOrder = (params: IUpdateIncomeOrder): Promise<AxiosResponse> =>
    this.patch(Endpoints.IncomeOne, params, { params: { id: params?.id } });

  deleteIncomeOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(Endpoints.IncomeOne, { params: { id } });

  updateIncomeOrderProduct = (params: IIncomeUpdateOrderProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.AddEditProductToArrival}`, params, { params: { id: params?.id } });

  orderProductAdd = (params: IIncomeOrderProductAdd): Promise<AxiosResponse> =>
    this.post(Endpoints.AddEditProductToArrival, params);

  deleteOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.delete(Endpoints.ProductMv, { params: { id: productId } });

  getAllUploadIncomeOrderToExel = (params: IGetIncomeOrdersParams): Promise<any> =>
    this.get(Endpoints.IncomeOrderAllExcel, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadIncomeOrderToExel = (incomeOrder: string): Promise<any> =>
    this.get(Endpoints.IncomeOrderOneExcel, {
      params: { id: incomeOrder },
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const incomeProductsApi = new IncomeProductsApi(config);
