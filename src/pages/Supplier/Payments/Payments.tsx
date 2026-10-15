import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { AddEditModal } from './AddEditModal';
import styles from './payments.scss';
import { paymentsColumns } from './constants';
import { supplierPaymentsStore } from '@/stores/supplier';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { priceFormat } from '@/utils/priceFormat';
import { addNotification } from '@/utils';
import { incomePaymentApi } from '@/api/payment-income';

const cn = classNames.bind(styles);

export const SupplierPayments = observer(() => {
  const { supplierId } = useParams();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: supplierPaymentsData, isLoading: loading } = useQuery({
    queryKey: [
      'getPayments',
      supplierPaymentsStore.pageNumber,
      supplierPaymentsStore.pageSize,
      supplierPaymentsStore.search,
      supplierPaymentsStore.startDate,
      supplierPaymentsStore.endDate,
      supplierId,
    ],
    queryFn: () =>
      supplierPaymentsStore.getSupplierPayments({
        pageNumber: supplierPaymentsStore.pageNumber,
        pageSize: supplierPaymentsStore.pageSize,
        search: supplierPaymentsStore.search!,
        startDate: supplierPaymentsStore?.startDate!,
        endDate: supplierPaymentsStore?.endDate!,
        userId: supplierId!,
      }),
  });

  const handleAddNewPayment = () => {
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierPaymentsStore.setSearch(e.currentTarget?.value);
  };


  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      supplierPaymentsStore.setStartDate(null);
    }
    supplierPaymentsStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      supplierPaymentsStore.setEndDate(null);
    }
    supplierPaymentsStore.setEndDate(new Date(dateString));
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierPaymentsStore.setPageNumber(page);
    supplierPaymentsStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    incomePaymentApi.getUploadPayments({
      pageNumber: supplierPaymentsStore.pageNumber,
      pageSize: supplierPaymentsStore.pageSize,
      search: supplierPaymentsStore.search!,
      startDate: supplierPaymentsStore?.startDate!,
      endDate: supplierPaymentsStore?.endDate!,
      userId: supplierId!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'to\'lovlar.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  useEffect(() => () => {
    supplierPaymentsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;langan qarzlar ro&apos;yxati</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Yetkazib beruvchilarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(supplierPaymentsStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(supplierPaymentsStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleAddNewPayment}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi to&apos;lov
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

      <Table
        columns={paymentsColumns}
        dataSource={supplierPaymentsData?.data?.data || []}
        loading={loading}
        pagination={{
          total: supplierPaymentsData?.data?.totalCount,
          current: supplierPaymentsStore?.pageNumber,
          pageSize: supplierPaymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(supplierPaymentsData?.data?.totalCount),
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(supplierPaymentsData?.data?.calc?.totalCash)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(supplierPaymentsData?.data?.calc?.totalCard)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(supplierPaymentsData?.data?.calc?.totalTransfer)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(supplierPaymentsData?.data?.calc?.totalOther)}
              </div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {supplierPaymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
