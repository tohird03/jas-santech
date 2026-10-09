import React from 'react';
import { observer } from 'mobx-react';
import { DataTable } from '@/components/Datatable/datatable';
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

export const ClientStatistic = observer(() => {
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
    <main>
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
        </div>
      </div>

      <DataTable
        rowKey="id"
        columns={staffsWorkingTimeReportsColumns}
        data={isError ? [] : (clientsStatisticData?.data?.data || [])}
        loading={loading}
        scroll={{x: 1620}}
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
