import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Spin } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { productsListStore, returnedOrdersStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/Datatable/datatable';
import { useMediaQuery } from '@/utils/mediaQuery';
import dayjs from 'dayjs';
import { clientsInfoStore } from '@/stores/clients';
import styles from '../returned-orders.scss';
import {
  IAddOrderModalForm,
  IOrderProducts,
} from '@/api/order/types';
import { ColumnType } from 'antd/es/table';
import { IAddProductsToReturnedOrder, IAddReturnedOrderProducts, IAddReturnedOrders } from '@/api/returned-order/types';
import { returnedOrderApi } from '@/api/returned-order/returned-order';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const countColor = (count: number, min_amount: number): string =>
  count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<IOrderProducts | null>(null);
  const [isOpenProductSelect, setIsOpenProductSelect] = useState(false);
  const countInputRef = useRef<HTMLInputElement>(null);

  // GET DATAS
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchClients],
    queryFn: () =>
      clientsInfoStore.getClients({
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

  const handleOpenPaymentModal = () => {
    if (returnedOrdersStore?.singleReturnedOrder?.id) {
      returnedOrdersStore.setSinglePayment({
        cash: returnedOrdersStore?.singleReturnedOrder?.payment?.cash,
        fromBalance: returnedOrdersStore?.singleReturnedOrder?.payment?.fromBalance,
      });
      returnedOrdersStore.setIsOpenPaymentModal(true);
    }
  };

  // SUBMIT FORMS
  const handleCreateOrUpdateOrder = () => {
    form.submit();
  };

  const handleSubmitProduct = (values: IAddOrderModalForm) => {
    setLoading(true);

    const addProducts: IAddReturnedOrderProducts = {
      productId: values?.productId,
      count: values?.count,
      price: values?.price,
    };

    if (returnedOrdersStore?.singleReturnedOrder?.id) {
      const addReturnedOrderProduct: IAddProductsToReturnedOrder = {
        ...addProducts,
        returningId: returnedOrdersStore?.singleReturnedOrder?.id,
      };

      // returnedOrderApi.updateReturnedOrder({
      //   id: returnedOrdersStore?.singleReturnedOrder?.id,
      // })
      //   .catch(addNotification)
      //   .finally(() => {
      //     setLoading(false);
      //   });

      returnedOrderApi.addProductToReturnedOrder(addReturnedOrderProduct)
        .then(() => {
          form.resetFields(['productId', 'price', 'count']);
          returnedOrdersStore.getSingleOrder(returnedOrdersStore?.singleReturnedOrder?.id!);
          queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    const createReturnedOrderData: IAddReturnedOrders = {
      clientId: values?.clientId,
      products: [addProducts],
      date: values?.date,
    };

    returnedOrderApi.addReturnedOrder(createReturnedOrderData)
      .then(res => {
        form.resetFields(['productId', 'price', 'count']);
        if (res?.data?.id) {
          returnedOrdersStore.getSingleOrder(res?.data?.id!);
        }
        queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    returnedOrdersStore.setSingleReturnedOrder(null);
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchClients = (value: string) => {
    setSearchClients(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeClientSelect = () => {
    setIsOpenProductSelect(true);
  };

  const handleFocusToProduct = () => {
    setIsOpenProductSelect(true);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.data?.find(product => product?.id === productId);

    form.setFieldValue('price', findProduct?.price);

    setIsOpenProductSelect(false);
    countInputRef.current?.focus();
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  // TABLE ACTIONS
  const handleEditProduct = (orderProduct: IOrderProducts) => {
    setIsUpdatingProduct(orderProduct);
  };

  const handleDeleteProduct = (orderId: string) => {
    returnedOrderApi.deleteProductFromReturnedOrder(orderId)
      .then(() => {
        returnedOrdersStore.getSingleOrder(returnedOrdersStore?.singleReturnedOrder?.id!)
          .finally(() => {
            setLoading(false);
          });

        queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
      })
      .catch(addNotification);
  };

  const handleChangePrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, price: value || 0 });
  };

  const handleChangeCount = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, count: value || 0 });
  };

  const handleSaveAndUpdateOrderProduct = () => {
    if (isUpdatingProduct) {
      returnedOrderApi.updateProductFromReturnedOrder({
        id: isUpdatingProduct?.id,
        price: isUpdatingProduct?.price,
        count: isUpdatingProduct?.count,
      })
        .then(res => {
          if (res) {
            returnedOrdersStore.getSingleOrder(returnedOrdersStore.singleReturnedOrder?.id!)
              .then(() => {
                setIsUpdatingProduct(null);
              })
              .finally(() => {
                setLoading(false);
              });

            queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
            addNotification('Mahsulot muvaffaqiyatli o\'zgartildi!');
          }
        })
        .catch(addNotification);
    }
  };

  const addOrderProductsColumns: ColumnType<IOrderProducts>[] = [
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
            placeholder="Narxi"
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
            defaultValue={record?.price}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangePrice}
          />
        ) : <span>{record?.price}</span>
      ),
    },
    {
      key: 'totalCost',
      dataIndex: 'totalCost',
      title: 'Jami narxi',
      align: 'center',
      render: (value, record) => priceFormat(record?.price * record?.count),
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

  const handleChangePriceForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('price')) {
      form.setFields([
        {
          name: 'price',
          errors: ['Mahsulot narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

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

  const getNextFieldName = (currentFieldName: string) => {
    const fieldNames = [
      'clientId',
      'productId',
      'price',
      'count',
    ];

    const currentIndex = fieldNames.indexOf(currentFieldName);

    return fieldNames[currentIndex + 1];
  };

  const handleBlurProduct = () => {
    setIsOpenProductSelect(false);
  };

  const clientsOptions = useMemo(() => (
    clientsData?.data?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.fullname}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (returnedOrdersStore?.singleReturnedOrder) {
      setSearchClients(returnedOrdersStore?.singleReturnedOrder?.client?.phone);

      form.setFieldsValue({
        // sellingDate: dayjs(returnedOrdersStore?.singleReturnedOrder?.sellingDate),
        clientId: returnedOrdersStore?.singleReturnedOrder?.client?.id,
      });
    }
  }, [returnedOrdersStore?.singleReturnedOrder]);

  const rowClassName = (record: IOrderProducts) => {
    if (returnedOrdersStore?.singleReturnedOrder?.products) {
      const isDuplicate = returnedOrdersStore?.singleReturnedOrder?.products?.filter(product => product?.product?.id === record?.product?.id).length > 1;

      return isDuplicate ? 'warning__row' : '';
    }

    return '';
  };

  return (
    <Modal
      open={returnedOrdersStore.isOpenAddEditReturnedOrderModal}
      keyboard
      title={(
        <div className={cn('order__add-products-header')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {returnedOrdersStore?.singleReturnedOrder?.id ? 'Qaytarishni tahrirlash' : 'Yangi qaytarish'}
          </div>
          <div>
            <Button
              type="primary"
              onClick={handleOpenPaymentModal}
              disabled={!returnedOrdersStore?.singleReturnedOrder?.id}
            >
              Qaytuvni saqlash
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
      {/* PRODUCTS FORM */}
      <Form
        form={form}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="order__add-products-form"
        onKeyPress={handleKeyPress}
      >
        <Form.Item
          label="Mijoz"
          rules={[{ required: true }]}
          name="clientId"
        >
          <Select
            showSearch
            placeholder="Mijoz"
            loading={loadingClients}
            optionFilterProp="children"
            notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchClients}
            onClear={handleClearClient}
            options={clientsOptions}
            onChange={handleChangeClientSelect}
            onSelect={(value) => handleSelectChange(value, 'clientId')}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Qaytaruv sanasi"
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
        <Form.Item
          label="Mahsulot"
          rules={[{ required: true }]}
          name="productId"
        >
          <Select
            showSearch
            placeholder="Mahsulot"
            loading={loadingProducts}
            optionFilterProp="children"
            notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={false}
            onSearch={handleSearchProducts}
            onChange={handleChangeProduct}
            optionLabelProp="label"
            open={isOpenProductSelect}
            onFocus={handleFocusToProduct}
            onBlur={handleBlurProduct}
          >
            {productsData?.data?.data.map((product) => (
              <Select.Option
                key={product?.id}
                value={product?.id}
                label={product?.name}
                className={cn('income-order__add-product')}
              >
                <div className={cn('income-order__add-product-option')}>
                  <p className={cn('income-order__add-product-name')}>
                    {product?.name}
                  </p>
                  <div className={cn('income-order__add-product-info')}>
                    <p className={cn('income-order__add-product-price')}>
                      {product?.price}
                    </p>
                    <p
                      style={{ backgroundColor: `${countColor(product?.count, product?.minAmount)}` }}
                      className={cn('income-order__add-product-count')}
                    >
                      {product?.count} dona
                    </p>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Narxi"
          rules={[{ required: true }]}
          name="price"
          initialValue={0}
        >
          <InputNumber
            placeholder="Sotib olingan narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            onKeyUp={handleChangePriceForm}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Mahsulot sonini kiriting"
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

      {/* PRODUCTS SHOW LIST */}
      <DataTable
        columns={addOrderProductsColumns}
        data={returnedOrdersStore?.singleReturnedOrder?.products || []}
        isMobile={isMobile}
        pagination={false}
        scroll={{ y: 300 }}
        rowClassName={rowClassName}
      />

      <div>
        <p style={{ textAlign: 'end', fontSize: '24px', fontWeight: 'bold' }}>Umumiy qiymati: {
          priceFormat(returnedOrdersStore?.singleReturnedOrder?.products?.reduce((prev, current) => prev + (current?.price * current?.count), 0))
        }
        </p>
      </div>
    </Modal>
  );
});
