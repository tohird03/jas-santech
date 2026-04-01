import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Select, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { AddEditModal } from './AddEditModal';
import styles from './staffs-payments.scss';
import { clientsColumns } from './constants';
import { staffsPaymentStore } from '@/stores/workers/staffs-payments';
import dayjs from 'dayjs';
import { staffsApi } from '@/api/staffs';
import { priceFormat } from '@/utils/priceFormat';
import { addNotification } from '@/utils';
import { dateFormat } from '@/utils/getDateFormat';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';

const cn = classNames.bind(styles);

export const StaffsPayments = observer(() => {
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: clientsInfoData, isLoading: loading } = useQuery({
    queryKey: [
      'getStaffsPayments',
      staffsPaymentStore.pageNumber,
      staffsPaymentStore.pageSize,
      staffsPaymentStore.sellerId,
      staffsPaymentStore.startDate,
      staffsPaymentStore.endDate,
    ],
    queryFn: () =>
      staffsPaymentStore.getStaffsPayments({
        pageNumber: staffsPaymentStore.pageNumber,
        pageSize: staffsPaymentStore.pageSize,
        userId: staffsPaymentStore.sellerId!,
        startDate: staffsPaymentStore.startDate!,
        endDate: staffsPaymentStore.endDate!,
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

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      staffsPaymentStore.setStartDate(null);
    }
    staffsPaymentStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      staffsPaymentStore.setEndDate(null);
    }
    staffsPaymentStore.setEndDate(new Date(dateString));
  };

  const handleAddNewClient = () => {
    staffsPaymentStore.setIsOpenAddEditStaffPaymentsModal(true);
  };

  const handleChangeSeller = (value: string) => {
    if (value) {
      staffsPaymentStore.setSellerId(value);

      return;
    }

    staffsPaymentStore.setSellerId(null);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    staffsPaymentStore.setPageNumber(page);
    staffsPaymentStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    staffsPaymentsApi.getAllUploadStaffPaymentExel({
      pageNumber: staffsPaymentStore.pageNumber,
      pageSize: staffsPaymentStore.pageSize,
      userId: staffsPaymentStore.sellerId!,
      startDate: staffsPaymentStore.startDate!,
      endDate: staffsPaymentStore.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${dateFormat(String(staffsPaymentStore.startDate!))}--${dateFormat(String(staffsPaymentStore.endDate!))}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const sellerOptions = useMemo(() => (
    sellerData?.data?.data.map((sellerData) => ({
      value: sellerData?.id,
      label: `${sellerData?.fullname}`,
    }))
  ), [sellerData]);

  useEffect(() => () => {
    staffsPaymentStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('client-info__head')}>
        <Typography.Title level={3}>Xodimlar hisoboti</Typography.Title>
        <div className={cn('client-info__filter')}>
          <Select
            options={sellerOptions}
            onChange={handleChangeSeller}
            style={{ width: '200px' }}
            placeholder="Sotuvchilar"
            loading={loadingSeller}
            allowClear
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(staffsPaymentStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(staffsPaymentStore.endDate)}
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
            onClick={handleAddNewClient}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            To&lsquo;lov qo&lsquo;shish
          </Button>
        </div>
      </div>

      <Table
        columns={clientsColumns}
        dataSource={clientsInfoData?.data?.data || []}
        loading={loading}
        pagination={{
          total: clientsInfoData?.data?.totalCount,
          current: staffsPaymentStore?.pageNumber,
          pageSize: staffsPaymentStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.data?.totalCount),
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(clientsInfoData?.data?.calc?.sum)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={3} index={1} />
          </Table.Summary.Row>
        )}
      />

      {staffsPaymentStore.isOpenAddEditStaffPaymentsModal && <AddEditModal />}
    </main>
  );
});
