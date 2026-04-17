import {authStore} from './auth';
import {profileStore} from './profile';
import {clientsInfoStore, paymentsStore, singleClientStore} from './clients';
import {staffsStore, currencyStore} from './workers';
import {supplierInfoStore, supplierPaymentsStore, singleSupplierStore} from './supplier';
import {productsListStore, incomeProductsStore, ordersStore, returnedOrdersStore} from './products';

export const stores = {
  authStore,
  profileStore,
  staffsStore,
  currencyStore,
  clientsInfoStore,
  paymentsStore,
  singleClientStore,
  supplierInfoStore,
  supplierPaymentsStore,
  singleSupplierStore,
  productsListStore,
  incomeProductsStore,
  ordersStore,
  returnedOrdersStore,
};

export const resetStores = () => {
  authStore.reset();
  profileStore.reset();
  staffsStore.reset();
  currencyStore.reset();
  clientsInfoStore.reset();
  paymentsStore.reset();
  singleClientStore.reset();
  supplierInfoStore.reset();
  supplierPaymentsStore.reset();
  singleSupplierStore.reset();
  productsListStore.reset();
  incomeProductsStore.reset();
  ordersStore.reset();
  returnedOrdersStore.reset();
};
