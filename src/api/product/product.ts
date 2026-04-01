import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditProduct, IGetProductsParams, IGetSingleProductParams, IGetSingleProducts, IProductTotalCalc, IProducts } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProducts = (params: IGetProductsParams): Promise<IResponse<IProducts[], IProductTotalCalc>> =>
    this.get(Endpoints.ProductsMany, { params });

  getSingleProducts = (productId: string): Promise<{data: IProducts}> =>
    this.get(Endpoints.ProductsOne, { params: {id: productId} });

  addNewProduct = (params: IAddEditProduct): Promise<AxiosResponse> =>
    this.post(Endpoints.ProductsOne, params);

  updateProduct = (params: IAddEditProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.ProductsOne}`, params, { params: { id: params?.id } });

  deleteProduct = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.ProductsOne}`, { params: { id } });

  getSingleProductStory = (params: IGetSingleProductParams): Promise<{ data: IGetSingleProducts }> =>
    this.get(Endpoints.ProductSingleStatus, { params });

  getProductsToExcel = (params: IGetProductsParams): Promise<any> =>
    this.get(Endpoints.GetProductsToExcel, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const productsApi = new ProductsApi(config);
