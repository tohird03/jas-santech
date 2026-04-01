import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './returned-orders.scss';
import { returnedOrdersColumns } from './constants';
import { returnedOrdersStore } from '@/stores/products';
import dayjs from 'dayjs';
import { PaymentModal } from './PaymentModal';
import { returnedOrderApi } from '@/api/returned-order/returned-order';
import { addNotification } from '@/utils';
import { ReturnedOrderShowInfoModal } from './OrderShowInfoModal';

const cn = classNames.bind(styles);

export const ReturnedOrders = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: returnedOrdersData, isLoading: loading } = useQuery({
    queryKey: [
      'getReturnedOrders',
      returnedOrdersStore.pageNumber,
      returnedOrdersStore.pageSize,
      returnedOrdersStore.search,
      returnedOrdersStore.startDate,
      returnedOrdersStore.endDate,
    ],
    queryFn: () =>
      returnedOrdersStore.getReturnedOrders({
        pageNumber: returnedOrdersStore.pageNumber,
        pageSize: returnedOrdersStore.pageSize,
        search: returnedOrdersStore.search!,
        startDate: returnedOrdersStore.startDate!,
        endDate: returnedOrdersStore.endDate!,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    returnedOrdersStore.setSearch(e.currentTarget?.value);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      returnedOrdersStore.setStartDate(null);
    }
    returnedOrdersStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      returnedOrdersStore.setEndDate(null);
    }
    returnedOrdersStore.setEndDate(new Date(dateString));
  };

  const handleAddNewReturnedOrder = () => {
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    returnedOrdersStore.setPageNumber(page);
    returnedOrdersStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    returnedOrderApi.getAllUploadReturnedOrderToExel({
      pageNumber: returnedOrdersStore.pageNumber,
      pageSize: returnedOrdersStore.pageSize,
      search: returnedOrdersStore.search!,
      startDate: returnedOrdersStore.startDate!,
      endDate: returnedOrdersStore.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'Returned-order.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  useEffect(() => () => {
    returnedOrdersStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('returned-orders__head')}>
        <Typography.Title level={3}>Mijozdan qaytgan mahsulotlar</Typography.Title>
        <div className={cn('returned-orders__filter')}>
          <Input
            placeholder="Mijozning ismini kiriting"
            allowClear
            onChange={handleSearch}
            className={cn('returned-orders__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(returnedOrdersStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(returnedOrdersStore.endDate)}
            allowClear={false}
          />
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
          <Button
            onClick={handleAddNewReturnedOrder}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi qaytarish qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={returnedOrdersColumns}
        data={returnedOrdersData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: returnedOrdersData?.data?.totalCount,
          current: returnedOrdersStore?.pageNumber,
          pageSize: returnedOrdersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(returnedOrdersData?.data?.totalCount),
        }}
      />

      {returnedOrdersStore.isOpenAddEditReturnedOrderModal && <AddEditModal />}
      {returnedOrdersStore.isOpenPaymentModal && <PaymentModal />}
      {returnedOrdersStore.isOpenShowProductModal && <ReturnedOrderShowInfoModal />}
    </main>
  );
});
