import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IGetProductsParams, IGetSingleProductParams, IGetSingleProducts, IProducts, ISingleProductStory } from '@/api/product/types';
import { productsApi } from '@/api/product/product';

class ProductsListStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 100;
  search: string | null = null;
  isOpenAddEditProductModal = false;
  singleProduct: IProducts | null = null;
  singleProductStory: IGetSingleProducts | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getProducts = (params: IGetProductsParams) =>
    productsApi.getProducts(params)
      .then(res => res)
      .catch(addNotification);

  getSingleProductStory = (params: IGetSingleProductParams) =>
    productsApi.getSingleProductStory(params)
      .then(res => {
        this.setSingleProductStory(res?.data);

        return res;
      })
      .catch(addNotification);

  getSingleProducts = (productId: string) =>
    productsApi.getSingleProducts(productId)
      .then(res => {
        this.setSingleProduct(res?.data);
      })
      .catch(addNotification);

  setSingleProductStory = (singleProductStory: IGetSingleProducts) => {
    this.singleProductStory = singleProductStory;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditProductModal = (isOpenAddEditProductModal: boolean) => {
    this.isOpenAddEditProductModal = isOpenAddEditProductModal;
  };

  setSingleProduct = (singleProduct: IProducts | null) => {
    this.singleProduct = singleProduct;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 100;
    this.search = null;
  }
}

export const productsListStore = new ProductsListStore();
