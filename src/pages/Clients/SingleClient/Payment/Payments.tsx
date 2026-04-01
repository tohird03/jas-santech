import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, DatePicker, DatePickerProps, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import styles from './payments.scss';
import {paymentsColumns} from './constants';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const cn = classNames.bind(styles);

export const Payments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {clientId} = useParams();

  const {data: clientsInfoData, isLoading: loading} = useQuery({
    queryKey: [
      'getPayments',
      singleClientStore.paymentPage,
      singleClientStore.paymentPageSize,
      singleClientStore.paymentSearch,
      singleClientStore.startDate,
      singleClientStore.endDate,
      singleClientStore.paymentSearch,
      singleClientStore.activeClient?.id,
    ],
    queryFn: () =>
      singleClientStore.getSingleClientsPayments({
        pageNumber: singleClientStore.paymentPage,
        pageSize: singleClientStore.paymentPageSize,
        search: singleClientStore.paymentSearch!,
        startDate: singleClientStore.startDate!,
        endDate: singleClientStore.endDate!,
        userId: clientId,
      }),
  });

  const handleAddNewPayment = () => {
    singleClientStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    singleClientStore.setPaymentSearch(e.currentTarget?.value);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setStartDate(null);
    }
    singleClientStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setEndDate(null);
    }
    singleClientStore.setEndDate(new Date(dateString));
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    singleClientStore.setPaymentPage(page);
    singleClientStore.setPaymentPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;lovlar</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(singleClientStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(singleClientStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleAddNewPayment}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mijoz to&apos;lovi
          </Button>
        </div>
      </div>

      <DataTable
        columns={paymentsColumns}
        data={clientsInfoData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: clientsInfoData?.data?.totalCount,
          current: singleClientStore?.paymentPage,
          pageSize: singleClientStore?.paymentPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.data?.totalCount),
        }}
      />

      {singleClientStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
