import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Select, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { resizableTableProps, useResizableColumns } from '@/components/Datatable/use-resizable-columns';
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
import { IStaffPaymentsTotal } from '@/api/staffs-payments/types';
import { currencyTagUi } from '@/constants/payment';

const cn = classNames.bind(styles);

const paymentColumnKeys = ['index', 'name', 'amount', 'note', 'date', 'actions'];
const paymentColumnTitles = [
  { key: 'index', title: '#' },
  { key: 'name', title: 'Xodim' },
  { key: 'amount', title: 'To\'lov qiymati' },
  { key: 'note', title: 'Ma\'lumot' },
  { key: 'date', title: 'To\'lov vaqti' },
  { key: 'actions', title: 'Amallar' },
];
const paymentDefaultWidths = {
  index: 64,
  name: 440,
  amount: 300,
  note: 280,
  date: 200,
  actions: 120,
};
const paymentMinWidths = {
  index: 56,
  name: 180,
  amount: 160,
  note: 120,
  date: 150,
  actions: 112,
};

export const StaffsPayments = observer(() => {
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const { boxRef, apply, picker } = useResizableColumns({
    keys: paymentColumnKeys,
    defaults: paymentDefaultWidths,
    mins: paymentMinWidths,
    titles: paymentColumnTitles,
  });
  const columns = apply(clientsColumns);

  const { data: staffPaymentsData, isLoading: loading } = useQuery({
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
        employeeId: staffsPaymentStore.sellerId!,
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
      employeeId: staffsPaymentStore.sellerId!,
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
    <main ref={boxRef}>
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
        {...resizableTableProps}
        columns={columns}
        dataSource={staffPaymentsData?.data?.data || []}
        loading={loading}
        pagination={{
          total: staffPaymentsData?.data?.totalCount,
          current: staffsPaymentStore?.pageNumber,
          pageSize: staffsPaymentStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(staffPaymentsData?.data?.totalCount),
        }}
        tableLayout="fixed"
        summary={() => (
          <Table.Summary.Row>
            {columns.map((column, index) => {
              if (column.key === 'name') {
                return (
                  <Table.Summary.Cell key={column.key} index={index} align="center">
                    <span className={cn('staff-payment__name')}>Jami</span>
                  </Table.Summary.Cell>
                );
              }

              if (column.key === 'amount') {
                return (
                  <Table.Summary.Cell key={column.key} index={index}>
                    <div className="currency-row" style={{ fontWeight: 600 }}>
                      {staffPaymentsData?.data?.calcByCurrency?.map((total: IStaffPaymentsTotal) => (
                        <span className="currency-item" key={total?.currency?.id}>
                          {priceFormat(total?.total)}{currencyTagUi(total?.currency?.symbol)}
                        </span>
                      ))}
                    </div>
                  </Table.Summary.Cell>
                );
              }

              return <Table.Summary.Cell key={String(column.key)} index={index} />;
            })}
          </Table.Summary.Row>
        )}
      />

      {staffsPaymentStore.isOpenAddEditStaffPaymentsModal && <AddEditModal />}
    </main>
  );
});
