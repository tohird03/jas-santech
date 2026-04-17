export const ROUTES = {
  home: '/',
  signIn: '/signin',
  myProfileHome: '/my-profile',

  // STAFFS
  workers: '/workers',
  workersStaffs: '/workers/staffs',
  workersStaffsPayments: '/workers/staffs-payments',
  workersCurrency: '/workers/currency',

  // CLIENTS
  clients: '/clients',
  clientsInfo: '/clients/clients-info',
  clientsPayments: '/clients/clients-payments',
  clientsSingleClient: '/clients/single-client/:clientId',
  clientsStatistic: '/clients/clients-statistic',

  // SUPPLIER
  supplier: '/supplier',
  supplierInfo: '/supplier/supplier-info',
  supplierPayments: '/supplier/supplier-payments',
  supplierSingleSupplier: '/supplier/single-supplier/:supplierId',

  // PRODUCTS
  products: '/products',
  productsList: '/products/list',
  productsIncome: '/products/income',
  productsOrder: '/products/order',
  productsReturnedOrder: '/products/returned-order',
  singleProduct: '/products/:productId',
} as const;

export const roleChecker = {
  storeKeeper: 'storekeeper',
  mainStoreKeeper: 'main-storekeeper',
};
