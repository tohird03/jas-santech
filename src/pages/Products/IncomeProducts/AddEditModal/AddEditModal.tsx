import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Image, Input, InputNumber, Modal, Popconfirm, Select, Spin } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { incomeProductsStore, productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMediaQuery } from '@/utils/mediaQuery';
import dayjs from 'dayjs';
import styles from '../income-products.scss';
import Table, { ColumnType } from 'antd/es/table';
import { incomeProductsApi } from '@/api/income-products';
import {
  IAddEditIncomeOrder,
  IAddIncomeOrderForm,
  IAddIncomeOrderProducts,
  IIncomeOrderProductAdd,
  IIncomeProduct,
  IUpdateIncomeProduct,
} from '@/api/income-products/types';
import { singleSupplierStore, supplierInfoStore } from '@/stores/supplier';
import { ISupplierInfo } from '@/api/supplier/types';
import { currencyTagUi } from '@/constants/payment';
import { authStore } from '@/stores/auth';
import { PriceWithCurrency } from '@/utils/hooks/valuteConversition';
import { useParams } from 'react-router-dom';
import { IProducts } from '@/api/product/types';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) => {
  if (!input) return true;
  const formattedInput = input.trim().toLowerCase();
  const formattedLabel = option?.label?.toLowerCase() || '';

  return formattedLabel.includes(formattedInput);
};

const countColor = (count: number, min_amount: number): string =>
  count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

const getNextFieldName = (currentFieldName: string) => {
  const fieldNames = [
    'supplierId',
    'productId',
    'price',
    'count',
  ];

  const currentIndex = fieldNames.indexOf(currentFieldName);

  return fieldNames[currentIndex + 1];
};

export const AddEditIncomeOrderModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<IUpdateIncomeProduct | null>(null);
  const [isOpenProductSelect, setIsOpenProductSelect] = useState(false);
  const countInputRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const { supplierId } = useParams();
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplierInfo | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);

  // GET DATAS
  const { data: supplierData, isLoading: loadingClients } = useQuery({
    queryKey: ['getSuppliers', searchClients],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: 1,
        pageSize: 15,
        search: searchClients!,
      }),
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['getProducts', searchProducts],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: 1,
        pageSize: 15,
        search: searchProducts!,
      }),
  });

  const { data: currencyMany } = useQuery({
    queryKey: ['getCurrencyMany'],
    queryFn: () =>
      authStore.getCurrencyMany(),
  });

  const handleOpenPaymentModal = () => {
    if (incomeProductsStore?.incomeOrder?.id) {
      incomeProductsStore.setIncomeOrderPayment({
        payment: incomeProductsStore?.incomeOrder?.payment,
        supplier: incomeProductsStore?.incomeOrder?.supplier,
        orderId: incomeProductsStore?.incomeOrder?.id,
      });
      incomeProductsStore.setIsOpenIncomePaymentModal(true);
    }
  };

  // SUBMIT FORMS
  const handleSaveAccepted = () => {
    setCreateLoading(true);

    incomeProductsApi.updateIncomeOrder({
      id: incomeProductsStore?.incomeOrder?.id!,
      supplierId: form.getFieldValue('supplierId'),
      description: form.getFieldValue('description'),
      date: form.getFieldValue('date'),
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        if (supplierId) {
          singleSupplierStore.getSingleSupplier({ id: supplierId });
        }
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setCreateLoading(false);
      });
  };

  const handleCreateOrUpdateOrder = () => {
    if (!form.getFieldValue('count')) {
      form.setFields([
        {
          name: 'count',
          errors: ['Mahsulot sonini kiriting!'],
        },
      ]);

      return;
    }

    form.submit();
  };

  const handleSubmitProduct = (values: IAddIncomeOrderForm) => {
    setLoading(true);

    const addProducts: IAddIncomeOrderProducts = {
      productId: values?.productId,
      count: values?.count,
      cost: values?.cost,
      price: values?.price,
      costCurrencyId: values?.costCurrencyId,
      priceCurrencyId: values?.priceCurrencyId,
    };

    if (incomeProductsStore?.incomeOrder) {
      const addOrderProduct: IIncomeOrderProductAdd = {
        ...addProducts,
        arrivalId: incomeProductsStore?.incomeOrder?.id,
      };

      incomeProductsApi.orderProductAdd(addOrderProduct)
        .then(() => {
          form.resetFields(['productId', 'cost', 'count', 'price']);
          incomeProductsStore.getSingleIncomeOrder(incomeProductsStore?.incomeOrder?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('productId');

              fieldInstance?.focus();
            });
          queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    const createOrderData: IAddEditIncomeOrder = {
      supplierId: values?.supplierId,
      date: values?.date,
      description: values?.description,
      products: [addProducts],
    };

    incomeProductsApi.addNewIncomeOrder(createOrderData)
      .then(res => {
        form.resetFields(['productId', 'cost', 'count', 'price']);
        if (res?.data?.id) {
          incomeProductsStore.getSingleIncomeOrder(res?.data?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('productId');

              fieldInstance?.focus();
            });
        } else {
          incomeProductsStore.setIncomeOrder(res?.data);
        }
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchSupplier = (value: string) => {
    setSearchClients(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.data?.find(product => product?.id === productId);

    if (findProduct) {
      form.setFieldValue('cost', findProduct?.prices?.cost?.price);
      form.setFieldValue('price', findProduct?.prices?.selling?.price);

      setSelectedProduct(findProduct);
    }


    setIsOpenProductSelect(false);
    countInputRef.current?.focus();
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  const supplierOptions = useMemo(() => (
    supplierData?.data?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.fullname}: +${supplier?.phone}`,
    }))
  ), [supplierData]);

  useEffect(() => {
    if (incomeProductsStore.singleIncomeOrder && incomeProductsStore?.incomeOrder) {
      setSearchClients(incomeProductsStore?.incomeOrder?.supplier?.fullname);
      setSelectedSupplier(incomeProductsStore?.incomeOrder?.supplier);

      form.setFieldsValue({
        date: dayjs(incomeProductsStore.incomeOrder?.date),
        supplierId: incomeProductsStore?.incomeOrder?.supplier?.id,
        description: incomeProductsStore?.incomeOrder?.description,
      });
    } else if (singleSupplierStore.activeSupplier?.id) {
      setSelectedSupplier(singleSupplierStore.activeSupplier);
      setSearchClients(singleSupplierStore.activeSupplier?.fullname);
      form.setFieldValue('supplierId', singleSupplierStore.activeSupplier?.id);
    }
  }, [incomeProductsStore.incomeOrder, singleSupplierStore.activeSupplier]);

  // TABLE ACTIONS
  const handleEditProduct = (orderProduct: IIncomeProduct) => {
    setIsUpdatingProduct({
      ...orderProduct,
      price: orderProduct?.prices?.selling?.price,
      cost: orderProduct?.prices?.selling?.price,
    });
  };

  const handleDeleteProduct = (orderId: string) => {
    incomeProductsApi.deleteOrderProduct(orderId)
      .then(() => {
        incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrder?.id!)
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(addNotification);
  };

  const handleChangePrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, cost: value || 0 });
  };

  const handleChangeCount = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, count: value || 0 });
  };

  const handleChangeSellingPrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, price: value || 0 });
  };

  const handleSaveAndUpdateOrderProduct = () => {
    if (isUpdatingProduct) {
      incomeProductsApi.updateIncomeOrderProduct({
        id: isUpdatingProduct?.id,
        cost: isUpdatingProduct?.cost,
        count: isUpdatingProduct?.count,
        price: isUpdatingProduct?.price,
      })
        .then(res => {
          if (res) {
            incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrder?.id!)
              .then(() => {
                setIsUpdatingProduct(null);
              })
              .finally(() => {
                setLoading(false);
              });
            addNotification('Mahsulot muvaffaqiyatli o\'zgartildi!');
          }
        })
        .catch(addNotification);
    }
  };

  const addOrderProductsColumns: ColumnType<IIncomeProduct>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'product_name',
      dataIndex: 'product_name',
      title: 'Mahsulot nomi',
      align: 'center',
      render: (value, record) => record?.product?.name,
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: 'Soni',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.count}
            placeholder="Soni"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangeCount}
          />
        ) : <span>{record?.count}</span>
      ),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Narxi',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.prices?.cost?.price}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangePrice}
          />
        ) : <span>{record?.prices?.cost?.price}</span>
      ),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Sotish narxi',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.prices?.cost?.price}
            placeholder="Sotish narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangeSellingPrice}
          />
        ) : <span>{record?.prices?.cost?.price}</span>
      ),
    },
    {
      key: 'totalCost',
      dataIndex: 'totalCost',
      title: 'Jami narxi',
      align: 'center',
      render: (value, record) => (
        <span>
          {priceFormat(record?.prices?.cost?.totalPrice)}
          {currencyTagUi(record?.prices?.cost?.currency?.symbol)}
        </span>
      ),
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Action',
      align: 'center',
      render: (value, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          {isUpdatingProduct?.id === record?.id ? (
            <Button
              onClick={handleSaveAndUpdateOrderProduct}
              type="primary"
              style={{ backgroundColor: 'green' }}
              icon={<CheckOutlined />}
            />
          ) : (
            <Button
              onClick={handleEditProduct.bind(null, record)}
              type="primary"
              icon={<EditOutlined />}
            />
          )
          }
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
            onConfirm={handleDeleteProduct.bind(null, record?.id)}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      if (!form.getFieldValue('count')) {
        form.setFields([
          {
            name: 'count',
            errors: ['Mahsulot sonini kiriting!'],
          },
        ]);

        return;
      }

      e.preventDefault();

      const fieldsValue = form.getFieldsValue();

      const requiredFields = form
        .getFieldsError()
        .filter((field) => field.errors.length > 0);

      const firstEmptyField = requiredFields.find(
        (field) => !fieldsValue[field.name[0]]
      );

      if (firstEmptyField) {
        const fieldInstance = form.getFieldInstance(firstEmptyField.name[0]);

        fieldInstance?.focus();
      } else {
        form.submit();
      }
    }
  };

  const handleSelectChange = (value: any, name: string) => {
    const nextFieldName = getNextFieldName(name);

    if (nextFieldName) {
      const nextField = form.getFieldInstance(nextFieldName);

      nextField?.focus();
    }
  };

  const handleAddSupplier = () => {
    supplierInfoStore.setIsOpenAddEditSupplierModal(true);
  };

  const handleBlurProduct = () => {
    setIsOpenProductSelect(false);
  };

  const handleAddProduct = () => {
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleEditProductSelectedProduct = () => {
    productsListStore.setSingleProduct(selectedProduct);
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleChangeCostForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('cost')) {
      form.setFields([
        {
          name: 'cost',
          errors: ['Mahsulot sotib olingan narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

  const handleChangePriceForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('price')) {
      form.setFields([
        {
          name: 'price',
          errors: ['Mahsulot sotiladigan narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

  const handleChangeClientSelect = (supplier: ISupplierInfo) => {
    setSelectedSupplier(supplier);
    setIsOpenProductSelect(true);
    productRef.current?.focus();
  };

  const handleFocusToProduct = () => {
    setIsOpenProductSelect(true);
  };

  const rowClassName = (record: IIncomeProduct) => {
    if (incomeProductsStore?.incomeOrder?.products) {
      const isDuplicate = incomeProductsStore?.incomeOrder?.products?.filter(product => product?.product?.id === record?.product?.id).length > 1;

      return isDuplicate ? 'warning__row' : '';
    }

    return '';
  };

  const currencyManyData = useMemo(() => (
    currencyMany?.data.map((currency) => ({
      value: currency?.id,
      label: `${currency?.symbol} | ${priceFormat(currency?.exchangeRate)}`,
      code: currency.symbol,
      rate: currency.exchangeRate,
    })) || []
  ), [currencyMany]);

  useEffect(() => {
    if (selectedProduct && productsData?.data?.data) {
      const updated = productsData.data.data.find(
        p => p.id === selectedProduct.id
      );

      if (updated) {
        setSelectedProduct(updated);
      }
    }
  }, [productsData]);

  return (
    <Modal
      open={incomeProductsStore.isOpenAddEditIncomeProductsModal}
      title={(
        <div className={cn('order__add-products-header')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <p style={{ margin: 0 }}>
              {selectedSupplier && (
                <>
                  Yetkazib beruvchi qarzi:{' '}
                  {selectedSupplier?.debtByCurrency?.length ? (
                    selectedSupplier.debtByCurrency.map(debt => (
                      <span key={debt?.currency?.id} style={{ marginRight: '8px' }}>
                        {priceFormat(debt?.amount)}
                        {currencyTagUi(debt?.currency?.symbol)}
                      </span>
                    ))
                  ) : (
                    '0'
                  )}
                </>
              )}
            </p>
            {incomeProductsStore?.incomeOrder?.id && (
              <Button
                type="primary"
                style={{ backgroundColor: 'green' }}
                onClick={handleSaveAccepted}
                loading={createLoading}
              >
                Saqlash
              </Button>
            )}
          </div>
          <div>
            <Button
              type="primary"
              onClick={handleOpenPaymentModal}
            >
              Yetkazib beruvchiga to&lsquo;lov
            </Button>
          </div>
        </div>
      )}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      style={{ top: 0, padding: 0 }}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
    >
      <Form
        form={form}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="order__add-products-form"
        onKeyPress={handleKeyPress}
      >
        <div className={cn('form__row')} style={{ display: 'flex' }}>
          <Form.Item
            rules={[{ required: true }]}
            name="supplierId"
            style={{ flex: 1, width: '100%' }}
          >
            <Select
              showSearch
              ref={clientRef}
              placeholder="Yetkazib beruvchi"
              loading={loadingClients}
              optionFilterProp="children"
              notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
              filterOption={filterOption}
              onSearch={handleSearchSupplier}
              onClear={handleClearClient}
              allowClear
              onChange={(value) => {
                const client = supplierData?.data?.data?.find((client) => client.id === value);

                if (client) {
                  handleChangeClientSelect(client);
                }
              }}
              onSelect={(value) => handleSelectChange(value, 'supplierId')}
              style={{ flex: 1, width: '100%' }}

            >
              {supplierData?.data?.data.map((supplier) => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {supplier.fullname}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {supplier.phone}
                      </div>

                    </div>
                    <div>
                      {supplier.debtByCurrency?.length
                        ? supplier.debtByCurrency.map((debt) => (
                          <span key={debt.currency?.id} style={{ marginRight: 6 }}>
                            {priceFormat(debt.amount)}
                            {currencyTagUi(debt.currency?.symbol)}
                          </span>
                        ))
                        : '0'}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button onClick={handleAddSupplier} icon={<PlusOutlined />} />
        </div>

        <Form.Item
          rules={[{ required: true }]}
          name="date"
          initialValue={dayjs()}
        >
          <DatePicker
            defaultValue={dayjs()}
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <div className={cn('form__row')} style={{ display: 'flex' }}>
          <Form.Item
            rules={[{ required: true }]}
            name="productId"
            style={{ flex: 1, width: '100%' }}
          >
            <Select
              showSearch
              placeholder="Mahsulot"
              loading={loadingProducts}
              optionFilterProp="children"
              notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
              filterOption={false}
              onSearch={handleSearchProducts}
              open={isOpenProductSelect}
              onChange={handleChangeProduct}
              optionLabelProp="label"
              onFocus={handleFocusToProduct}
              ref={productRef}
              onBlur={handleBlurProduct}
            >
              {productsData?.data?.data.map((product) => (
                <Select.Option
                  key={product?.id}
                  value={product?.id}
                  label={product?.name}
                  className={cn('income-order__add-product')}
                >
                  <div className={cn('order__add-select-option')}>
                    <div className={cn('income-order__add-product-option')}>
                      <p className={cn('income-order__add-product-name')}>
                        {product?.name}
                      </p>
                      <div className={cn('income-order__add-product-info')}>
                        <p className={cn('income-order__add-product-price')}>
                          {priceFormat(product?.prices?.selling?.price)} {currencyTagUi(product?.prices?.selling?.currency?.symbol)}
                        </p>
                        <p
                          style={{ backgroundColor: `${countColor(product?.count, product?.minAmount)}` }}
                          className={cn('income-order__add-product-count')}
                        >
                          {product?.count} dona
                        </p>
                      </div>
                    </div>
                    <p className={cn('order__add-product-desc')}>
                      {product?.description}
                    </p>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button onClick={handleAddProduct} icon={<PlusOutlined />} />
          <Button onClick={handleEditProductSelectedProduct} icon={<EditOutlined />} />
        </div>
        <PriceWithCurrency
          form={form}
          valueName="price"
          currencyName="priceCurrencyId"
          label="Sotish narxi"
          required
          onKeyDown={handleChangePriceForm}
          currencyOptions={currencyManyData}
        />
        <PriceWithCurrency
          form={form}
          valueName="cost"
          currencyName="costCurrencyId"
          label="Sotib olish narxi"
          required
          onKeyDown={handleChangeCostForm}
          currencyOptions={currencyManyData}
        />
        <Form.Item
          name="description"
        >
          <Input.TextArea
            placeholder="Tushum haqida ma'lumot"
            rows={4}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Tushuriladigan mahsulot sonini kiriting"
            style={{ width: '100%' }}
            ref={countInputRef}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Button
          onClick={handleCreateOrUpdateOrder}
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
        >
          Qo&apos;shish
        </Button>
      </Form>

      <Table
        columns={addOrderProductsColumns}
        dataSource={incomeProductsStore?.incomeOrder?.products || []}
        pagination={false}
        scroll={{ x: 500 }}
        rowClassName={rowClassName}
      />

      <div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '20px' }}>
          <p style={{ margin: '0' }}>Umumiy qiymati:</p>
          <div style={{ textAlign: 'end' }}>
            {incomeProductsStore?.incomeOrder?.totalPrices?.cost?.map(price =>
              <div key={price?.currencyId}>{priceFormat(price?.total)}{currencyTagUi(price?.currency?.symbol)}</div>)}
          </div>
        </div>
      </div>
    </Modal>
  );
});
