import React from 'react';
import { observer } from 'mobx-react';
import { DataTable } from '@/components/Datatable/datatable';
import { resizableTableProps, useResizableColumns } from '@/components/Datatable/use-resizable-columns';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { staffsWorkingTimeReportsColumns } from './constants';
import { DatePicker, DatePickerProps, Input, Typography } from 'antd';
import styles from './styles.scss';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import { clientsStatisticStore } from '@/stores/clients';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'usehooks-ts';

const cn = classNames.bind(styles);

const reportColumnKeys = [
  'index',
  'name',
  'sellingCount',
  'sellingSum',
  'sellingPaymentCount',
  'sellingPaymentSum',
  'clientPaymentCount',
  'clientPaymentSum',
  'returningCount',
  'returningSum',
  'debt',
];
const reportColumnTitles = [
  { key: 'index', title: '#' },
  { key: 'name', title: 'Mijoz' },
  { key: 'sellingCount', title: 'Sotuv soni' },
  { key: 'sellingSum', title: 'Sotuv summa' },
  { key: 'sellingPaymentCount', title: 'Sotuv to\'lovi soni' },
  { key: 'sellingPaymentSum', title: 'Sotuv to\'lovi summa' },
  { key: 'clientPaymentCount', title: 'Alohida to\'lov soni' },
  { key: 'clientPaymentSum', title: 'Alohida to\'lov summa' },
  { key: 'returningCount', title: 'Qaytaruv soni' },
  { key: 'returningSum', title: 'Qaytaruv to\'lov' },
  { key: 'debt', title: 'Qarz' },
];
const reportDefaultWidths = {
  index: 64,
  name: 320,
  sellingCount: 80,
  sellingSum: 180,
  sellingPaymentCount: 80,
  sellingPaymentSum: 180,
  clientPaymentCount: 80,
  clientPaymentSum: 180,
  returningCount: 80,
  returningSum: 180,
  debt: 180,
};
const reportMinWidths = {
  index: 56,
  name: 140,
  sellingCount: 64,
  sellingSum: 120,
  sellingPaymentCount: 64,
  sellingPaymentSum: 120,
  clientPaymentCount: 64,
  clientPaymentSum: 120,
  returningCount: 64,
  returningSum: 120,
  debt: 120,
};

export const ClientStatistic = observer(() => {
  const { boxRef, apply, picker } = useResizableColumns({
    keys: reportColumnKeys,
    defaults: reportDefaultWidths,
    mins: reportMinWidths,
    titles: reportColumnTitles,
    flexKey: 'name',
    fit: false,
  });
  const columns = apply(staffsWorkingTimeReportsColumns);
  const search = useDebounce(clientsStatisticStore.search || '', 400);
  const { data: clientsStatisticData, isLoading: loading, isError } = useQuery({
    queryKey: [
      'clientReport',
      clientsStatisticStore?.pageNumber,
      clientsStatisticStore?.pageSize,
      search,
      clientsStatisticStore?.startDate,
      clientsStatisticStore?.endDate,
    ],
    queryFn: () =>
      clientsStatisticStore.getClientsStatistic({
        pageNumber: clientsStatisticStore.pageNumber,
        pageSize: clientsStatisticStore.pageSize,
        search,
        startDate: clientsStatisticStore.startDate || undefined,
        endDate: clientsStatisticStore.endDate || undefined,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clientsStatisticStore.setPageNumber(1);
    clientsStatisticStore.setSearch(e.currentTarget?.value);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    clientsStatisticStore.setPageNumber(1);
    clientsStatisticStore.setStartDate(date && dateString ? new Date(String(dateString)) : null);
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    clientsStatisticStore.setPageNumber(1);
    clientsStatisticStore.setEndDate(date && dateString ? new Date(String(dateString)) : null);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    clientsStatisticStore.setPageNumber(page);
    clientsStatisticStore.setPageSize(pageSize!);
  };

  return (
    <main ref={boxRef}>
      <div className={cn('client-report__head')}>
        <Typography.Title level={3}>Mijozlar hisoboti</Typography.Title>
        <div className={cn('client-report__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('orders__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(clientsStatisticStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(clientsStatisticStore.endDate)}
            allowClear={false}
          />
          {picker}
        </div>
      </div>

      <DataTable
        rowKey="id"
        className={`${resizableTableProps.className} resizable-table--scroll`}
        columns={columns}
        tableLayout={resizableTableProps.tableLayout}
        components={resizableTableProps.components}
        data={isError ? [] : (clientsStatisticData?.data?.data || [])}
        loading={loading}
        scroll={{x: true}}
        pagination={{
          total: clientsStatisticData?.data?.totalCount,
          current: clientsStatisticStore?.pageNumber,
          pageSize: clientsStatisticStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsStatisticData?.data?.totalCount),
        }}
      />
    </main>
  );
});
