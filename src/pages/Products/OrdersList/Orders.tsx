import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Pagination, Select, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal as AddEditOrder } from './AddEditModal';
import styles from './orders.scss';
import { FilterOrderStatusOptions, ordersColumns, ordersTotalCalc } from './constants';
import { ordersStore, productsListStore } from '@/stores/products';
import dayjs from 'dayjs';
import { OrderShowInfoModal } from './OrderShowInfoModal';
import { PaymentModal } from './PaymentModal';
import { clientsInfoStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import { ordersApi } from '@/api/order';
import { addNotification } from '@/utils';
import { AddEditModal as AddEditClientModal } from '@/pages/Clients/ClientsInfo/AddEditModal';
import { AddEditModal } from '../ProductsList/AddEditModal';
import { dateFormat } from '@/utils/getDateFormat';
import { staffsApi } from '@/api/staffs';
import { IOrderStatus } from '@/api/order/types';

const cn = classNames.bind(styles);

export const Orders = observer(() => {
  const { clientId } = useParams();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: ordersData, isLoading: loading } = useQuery({
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

  const { data: sellerData, isLoading: loadingSeller } = useQuery({
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

  return (
    <main>
      <div className={cn('orders__head')}>
        <Typography.Title level={3}>Sotuvlar ro&apos;yxati</Typography.Title>
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
            className={cn('orders__search')}
            placeholder="Sotuvchilar"
            loading={loadingSeller}
            allowClear
          />
          <Select
            options={FilterOrderStatusOptions}
            onChange={handleChangeFilter}
            className={cn('orders__search')}
            placeholder="Sotuv holati"
            allowClear
          />
          <Button
            onClick={handleAddNewOrder}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi sotuv qo&apos;shish
          </Button>
          <Tooltip placement="top" title="Excelda yuklash">
            <Button
              onClick={handleDownloadExcel}
              type="primary"
              icon={<DownloadOutlined />}
              loading={downloadLoading}
            >
              Exelda Yuklash
            </Button>
          </Tooltip>
        </div>
      </div>

      <DataTable
        columns={ordersColumns}
        data={ordersData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: ordersData?.data?.totalCount,
          current: ordersStore?.pageNumber,
          pageSize: ordersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(ordersData?.data?.totalCount),
        }}
      />

      <div>
        <DataTable
          columns={ordersTotalCalc}
          data={[ordersData?.data?.calc || {}]}
          isMobile
          loading={loading}
          cardStyle={{ width: '500px' }}
          className="total-calc"
          loadingLength={1}
        />
      </div>

      {ordersStore.isOpenAddEditNewOrderModal && <AddEditOrder />}
      {ordersStore.isOpenShowOrderModal && <OrderShowInfoModal />}
      {ordersStore.isOpenPaymentModal && <PaymentModal />}
      {clientsInfoStore.isOpenAddEditClientModal && <AddEditClientModal />}
      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
