import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddOrder,
  IGetOrdersParams,
  IOrder,
  IOrderProductAdd,
  ITotalOrderPaymentCalc,
  IUpdateOrder,
  IUpdateOrderProduct,
  IUploadOrderToExelParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class OrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrders = (params: IGetOrdersParams): Promise<IResponse<IOrder[], ITotalOrderPaymentCalc>> =>
    this.get(Endpoints.SellingMany, { params });

  addNewOrder = (params: IAddOrder): Promise<{ data: IOrder }> =>
    this.resPost(Endpoints.SellingOne, params);

  getSingleOrder = (orderId: string): Promise<{ data: IOrder }> =>
    this.get(Endpoints.SellingOne, { params: { id: orderId } });

  updateOrder = (params: IUpdateOrder): Promise<AxiosResponse> =>
    this.patch(Endpoints.SellingOne, params, { params: { id: params?.id } });

  deleteOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(Endpoints.SellingOne, { params: { id, method: 'hard' } });

  orderProductAdd = (params: IOrderProductAdd): Promise<AxiosResponse> =>
    this.post(Endpoints.AddEditProductToSelling, params);

  updateOrderProduct = (params: IUpdateOrderProduct): Promise<AxiosResponse> =>
    this.patch(Endpoints.AddEditProductToSelling, params, { params: { id: params?.id } });

  deleteOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.delete(Endpoints.ProductMv, { params: { id: productId } });

  getAllUploadOrderToExel = (params: IGetOrdersParams): Promise<any> =>
    this.get(`${Endpoints.OrderAllExcel}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadOrderToExel = (params: IUploadOrderToExelParams): Promise<any> =>
    this.get(`${Endpoints.OrderOneExcel}`, {
      params: { id: params?.orderId },
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const ordersApi = new OrdersApi(config);
