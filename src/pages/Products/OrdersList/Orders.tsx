import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DownloadOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, DatePicker, DatePickerProps, Input, Select, Table, Tooltip, Typography} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import {ordersApi} from '@/api/order';
import {IOrderStatus, IOrderTotalPrice} from '@/api/order/types';
import {staffsApi} from '@/api/staffs';
import {DataTable} from '@/components/Datatable/datatable';
import {resizableTableProps, useResizableColumns} from '@/components/Datatable/use-resizable-columns';
import {currencyTagUi} from '@/constants/payment';
import {AddEditModal as AddEditClientModal} from '@/pages/Clients/ClientsInfo/AddEditModal';
import {clientsInfoStore} from '@/stores/clients';
import {ordersStore, productsListStore} from '@/stores/products';
import {addNotification} from '@/utils';
import {dateFormat} from '@/utils/getDateFormat';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {AddEditModal} from '../ProductsList/AddEditModal';
import {AddEditModal as AddEditOrder} from './AddEditModal';
import {FilterOrderStatusOptions, ordersColumns} from './constants';
import styles from './orders.scss';
import {OrderShowInfoModal} from './OrderShowInfoModal';
import {PaymentModal} from './PaymentModal';

const cn = classNames.bind(styles);

const orderColumnKeys = ['index', 'client', 'status', 'payment', 'seller', 'totalPrice', 'totalPay', 'debt', 'createdAt', 'description', 'action'];
const orderColumnTitles = [
  {key: 'index', title: '#'},
  {key: 'client', title: 'Mijoz'},
  {key: 'status', title: 'Sotuv holati'},
  {key: 'payment', title: 'To\'lov holati'},
  {key: 'seller', title: 'Sotuvchi'},
  {key: 'totalPrice', title: 'Jami narxi'},
  {key: 'totalPay', title: 'Jami to\'lov'},
  {key: 'debt', title: 'Qarzga'},
  {key: 'createdAt', title: 'Sotilgan vaqti'},
  {key: 'description', title: 'Ma\'lumot'},
  {key: 'action', title: 'Amallar'},
];
const orderDefaultWidths = {
  index: 48,
  client: 240,
  status: 140,
  payment: 116,
  seller: 88,
  totalPrice: 140,
  totalPay: 140,
  debt: 140,
  createdAt: 124,
  description: 180,
  action: 136,
};
const orderMinWidths = {
  index: 44,
  client: 160,
  status: 136,
  payment: 112,
  seller: 80,
  totalPrice: 132,
  totalPay: 132,
  debt: 132,
  createdAt: 118,
  description: 120,
  action: 128,
};

const orderMoney = (items?: IOrderTotalPrice[]) => {
  if (!items?.length) {
    return 0;
  }

  return (
    <div className="orders-money">
      {items.map((price) => (
        <span className="orders-money__line" key={price?.currency?.id}>
          {priceFormat(price?.total)}
          {currencyTagUi(price?.currency?.symbol)}
        </span>
      ))}
    </div>
  );
};

export const Orders = observer(() => {
  const {clientId} = useParams();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const {boxRef, apply, picker} = useResizableColumns({
    keys: orderColumnKeys,
    defaults: orderDefaultWidths,
    mins: orderMinWidths,
    titles: orderColumnTitles,
    flexKey: 'client',
  });
  const columns = apply(ordersColumns);

  const {data: ordersData, isLoading: loading} = useQuery({
    queryKey: [
      'getOrders',
      ordersStore.pageNumber,
      ordersStore.pageSize,
      ordersStore.search,
      ordersStore.startDate,
      ordersStore.endDate,
      ordersStore.accepted,
      ordersStore.sellerId,
      clientId,
    ],
    queryFn: () =>
      ordersStore.getOrders({
        pageNumber: ordersStore.pageNumber,
        pageSize: ordersStore.pageSize,
        search: ordersStore.search!,
        startDate: ordersStore.startDate!,
        endDate: ordersStore.endDate!,
        staffId: ordersStore.sellerId!,
        status: ordersStore.accepted!,
        clientId,
      }),
  });

  const {data: sellerData, isLoading: loadingSeller} = useQuery({
    queryKey: ['getSellers'],
    queryFn: () =>
      staffsApi.getStaffs({
        pageNumber: 1,
        pageSize: 100,
      }),
  });

  const handleAddNewOrder = () => {
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    ordersApi.getAllUploadOrderToExel({
      pageNumber: ordersStore.pageNumber,
      pageSize: ordersStore.pageSize,
      search: ordersStore.search!,
      startDate: ordersStore.startDate!,
      endDate: ordersStore.endDate!,
      staffId: ordersStore.sellerId!,
      status: ordersStore.accepted!,
      clientId,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${dateFormat(String(ordersStore.startDate!))}--${dateFormat(String(ordersStore.endDate!))}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    ordersStore.setSearch(e.currentTarget?.value);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      ordersStore.setStartDate(null);
    }
    ordersStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      ordersStore.setEndDate(null);
    }
    ordersStore.setEndDate(new Date(dateString));
  };

  const handleChangeFilter = (value: IOrderStatus) => {
    if (value) {
      ordersStore.setAccepted(value);

      return;
    }

    ordersStore.setAccepted(null);
  };

  const handleChangeSeller = (value: string) => {
    if (value) {
      ordersStore.setSellerId(value);

      return;
    }

    ordersStore.setSellerId(null);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    ordersStore.setPageNumber(page);
    ordersStore.setPageSize(pageSize!);
  };

  const sellerOptions = useMemo(() => (
    sellerData?.data?.data.map((sellerData) => ({
      value: sellerData?.id,
      label: `${sellerData?.fullname}`,
    }))
  ), [sellerData]);

  useEffect(() => () => {
    ordersStore.reset();
  }, []);

  const calc = ordersData?.data?.calcPage;
  const summaryLabelKey = columns.some((column) => column.key === 'client')
    ? 'client'
    : String(columns[0]?.key ?? '');

  return (
    <main ref={boxRef} className="orders-page">
      <div className={cn('orders__head')}>
        <Typography.Title level={3} className={cn('orders__title')}>Sotuvlar ro&apos;yxati</Typography.Title>
        <div className={cn('orders__actions')}>
          {picker}
          <Tooltip placement="top" title="Excelda yuklash">
            <Button
              onClick={handleDownloadExcel}
              type="primary"
              icon={<DownloadOutlined />}
              loading={downloadLoading}
            >
              Excelga yuklash
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Yangi sotuv qo'shish">
            <Button
              onClick={handleAddNewOrder}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Qo&apos;shish
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className={cn('orders__filter')}>
        <Input
          placeholder="Sotuvlarni qidirish"
          allowClear
          onChange={handleSearch}
          className={cn('orders__search')}
        />
        <DatePicker
          className={cn('promotion__datePicker')}
          onChange={handleStartDateChange}
          placeholder={'Boshlanish sanasi'}
          defaultValue={dayjs(ordersStore.startDate)}
          allowClear={false}
        />
        <DatePicker
          className={cn('promotion__datePicker')}
          onChange={handleEndDateChange}
          placeholder={'Tugash sanasi'}
          defaultValue={dayjs(ordersStore.endDate)}
          allowClear={false}
        />
        <Select
          options={sellerOptions}
          onChange={handleChangeSeller}
          placeholder="Sotuvchilar"
          loading={loadingSeller}
          allowClear
        />
        <Select
          options={FilterOrderStatusOptions}
          onChange={handleChangeFilter}
          placeholder="Sotuv holati"
          allowClear
        />
      </div>

      {isMobile ? (
        <>
          <div className={cn('orders__total')}>
            <div className={cn('orders__total-item')}>
              <span>Jami narxi</span>
              <div>{orderMoney(calc?.totalPrices)}</div>
            </div>
            <div className={cn('orders__total-item')}>
              <span>Jami to&apos;lov</span>
              <div>{orderMoney(calc?.totalPayments)}</div>
            </div>
            <div className={cn('orders__total-item')}>
              <span>Qarzga</span>
              <div>{orderMoney(calc?.totalDebts)}</div>
            </div>
          </div>
          <DataTable
            className="orders-page__cards"
            columns={columns}
            data={ordersData?.data?.data || []}
            loading={loading}
            isMobile
            pagination={{
              total: ordersData?.data?.totalCount,
              current: ordersStore?.pageNumber,
              pageSize: ordersStore?.pageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(ordersData?.data?.totalCount),
            }}
          />
        </>
      ) : (
        <Table
          {...resizableTableProps}
          className="resizable-table orders-table"
          bordered
          rowKey="id"
          columns={columns}
          dataSource={ordersData?.data?.data || []}
          loading={loading}
          scroll={{y: 400}}
          pagination={{
            total: ordersData?.data?.totalCount,
            current: ordersStore?.pageNumber,
            pageSize: ordersStore?.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100, 500, 1000],
            onChange: handlePageChange,
            ...getPaginationParams(ordersData?.data?.totalCount),
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                {columns.map((column, index) => {
                  const key = String(column.key);
                  let content: React.ReactNode = null;

                  if (key === summaryLabelKey) {
                    content = 'Jami';
                  } else if (key === 'totalPrice') {
                    content = orderMoney(calc?.totalPrices);
                  } else if (key === 'totalPay') {
                    content = orderMoney(calc?.totalPayments);
                  } else if (key === 'debt') {
                    content = orderMoney(calc?.totalDebts);
                  }

                  return (
                    <Table.Summary.Cell key={key} index={index}>
                      <div style={{fontWeight: 'bold', textAlign: 'center'}}>{content}</div>
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      )}

      {ordersStore.isOpenAddEditNewOrderModal && <AddEditOrder />}
      {ordersStore.isOpenShowOrderModal && <OrderShowInfoModal />}
      {ordersStore.isOpenPaymentModal && <PaymentModal />}
      {clientsInfoStore.isOpenAddEditClientModal && <AddEditClientModal />}
      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
