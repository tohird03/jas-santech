import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddProductsToReturnedOrder,
  IAddReturnedOrders,
  IGetReturnedOrdersParams,
  IReturnedOrder,
  IUpdateProductFromReturnedOrders,
  IUpdateReturnedOrder,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ReturnedOrderApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getReturnedOrders = (params: IGetReturnedOrdersParams): Promise<IResponse<IReturnedOrder[]>> =>
    this.get(Endpoints.ReturnedOrderMany, { params });

  addReturnedOrder = (params: IAddReturnedOrders): Promise<{ data: IReturnedOrder }> =>
    this.resPost(Endpoints.ReturnedOrderOne, params);

  getSingleReturnedOrder = (orderId: string): Promise<{ data: IReturnedOrder }> =>
    this.get(Endpoints.ReturnedOrderOne, { params: { id: orderId } });

  updateReturnedOrder = (params: IUpdateReturnedOrder): Promise<AxiosResponse> =>
    this.patch(Endpoints.ReturnedOrderOne, params, { params: { id: params?.id } });

  addProductToReturnedOrder = (params: IAddProductsToReturnedOrder): Promise<AxiosResponse> =>
    this.post(Endpoints.AddEditProductToReturning, params);

  updateProductFromReturnedOrder = (params: IUpdateProductFromReturnedOrders): Promise<AxiosResponse> =>
    this.patch(Endpoints.AddEditProductToReturning, params, { params: { id: params?.id } });

  getAllUploadReturnedOrderToExel = (params: IGetReturnedOrdersParams): Promise<any> =>
    this.get(`${Endpoints.ReturnedAllExcel}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadReturnedOrderToExel = (returnedOrderId: string): Promise<any> =>
    this.get(Endpoints.ReturnedOneExcel, {
      params: { id: returnedOrderId },
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  deleteReturnedOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(Endpoints.ReturnedOrderOne, { params: { id, method: 'hard' } });
  // XATO

  deleteProductFromReturnedOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.returnedProduct}/${id}`);

}

export const returnedOrderApi = new ReturnedOrderApi(config);
