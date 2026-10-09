import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Select, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { resizableTableProps, useResizableColumns } from '@/components/Datatable/use-resizable-columns';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { AddEditModal } from './AddEditModal';
import styles from './payments.scss';
import { paymentsColumns } from './constants';
import { paymentsStore } from '@/stores/clients';
import dayjs from 'dayjs';
import { addNotification } from '@/utils';
import { staffsApi } from '@/api/staffs';
import { priceFormat } from '@/utils/priceFormat';
import { clientsPaymentApi } from '@/api/payment/payment';
import { useParams } from 'react-router-dom';
import { currencyTagUi } from '@/constants/payment';

const cn = classNames.bind(styles);

const paymentColumnKeys = ['index', 'client', 'cash', 'description', 'createdAt', 'seller', 'action'];
const paymentColumnTitles = [
  { key: 'index', title: '#' },
  { key: 'client', title: 'Mijoz' },
  { key: 'cash', title: 'Jami to\'lov' },
  { key: 'description', title: 'Ma\'lumot' },
  { key: 'createdAt', title: 'To\'lov vaqti' },
  { key: 'seller', title: 'Sotuvchi' },
  { key: 'action', title: 'Amallar' },
];
const paymentDefaultWidths = {
  index: 64,
  client: 260,
  cash: 200,
  description: 220,
  createdAt: 170,
  seller: 160,
  action: 120,
};
const paymentMinWidths = {
  index: 56,
  client: 150,
  cash: 140,
  description: 120,
  createdAt: 140,
  seller: 120,
  action: 112,
};

export const ClientsPayments = observer(() => {
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const { clientId } = useParams();
  const { boxRef, apply, picker } = useResizableColumns({
    keys: paymentColumnKeys,
    defaults: paymentDefaultWidths,
    mins: paymentMinWidths,
    titles: paymentColumnTitles,
    flexKey: 'client',
  });
  const columns = apply(paymentsColumns);

  const { data: paymentsData, isLoading: loading } = useQuery({
    queryKey: [
      'getPayments',
      paymentsStore.pageNumber,
      paymentsStore.pageSize,
      paymentsStore.search,
      paymentsStore.startDate,
      paymentsStore.endDate,
      paymentsStore.sellerId,
      clientId,
    ],
    queryFn: () =>
      paymentsStore.getClientsPayments({
        pageNumber: paymentsStore.pageNumber,
        pageSize: paymentsStore.pageSize,
        search: paymentsStore.search!,
        startDate: paymentsStore?.startDate!,
        endDate: paymentsStore?.endDate!,
        staffId: paymentsStore.sellerId!,
        clientId: clientId!,
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

  const handleAddNewPayment = () => {
    paymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    paymentsStore.setSearch(e.currentTarget?.value);
  };

  const handleChangeSeller = (value: string) => {
    if (value) {
      paymentsStore.setSellerId(value);

      return;
    }

    paymentsStore.setSellerId(null);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      paymentsStore.setStartDate(null);
    }
    paymentsStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      paymentsStore.setEndDate(null);
    }
    paymentsStore.setEndDate(new Date(dateString));
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    paymentsStore.setPageNumber(page);
    paymentsStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    clientsPaymentApi.getUploadPayments({
      pageNumber: paymentsStore.pageNumber,
      pageSize: paymentsStore.pageSize,
      search: paymentsStore.search!,
      startDate: paymentsStore.startDate!,
      endDate: paymentsStore.endDate!,
      staffId: paymentsStore.sellerId!,
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

  const sellerOptions = useMemo(() => (
    sellerData?.data?.data.map((sellerData) => ({
      value: sellerData?.id,
      label: `${sellerData?.fullname}`,
    }))
  ), [sellerData]);

  useEffect(() => () => {
    paymentsStore.reset();
  }, []);

  return (
    <main ref={boxRef}>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;lovlar ro&apos;yxati</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
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
            defaultValue={dayjs(paymentsStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(paymentsStore.endDate)}
            allowClear={false}
          />
          <div className={cn('clients-payments__actions')}>
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
              onClick={handleAddNewPayment}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Mijoz to&apos;lovi
            </Button>
          </div>
        </div>
      </div>

      <Table
        {...resizableTableProps}
        columns={columns}
        dataSource={paymentsData?.data?.data || []}
        loading={loading}
        pagination={{
          total: paymentsData?.data?.totalCount,
          current: paymentsStore?.pageNumber,
          pageSize: paymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(paymentsData?.data?.totalCount),
        }}
        summary={() => (
          <Table.Summary.Row>
            {columns.map((column, index) => {
              if (column.key === 'cash') {
                return (
                  <Table.Summary.Cell key={column.key} index={index}>
                    <div className="currency-row" style={{ fontWeight: 'bold' }}>
                      {paymentsData?.data?.calcByCurrency?.map(payment => (
                        <span className="currency-item" key={payment?.currency?.id}>
                          {priceFormat(payment?.total)}
                          {currencyTagUi(payment?.currency?.symbol)}
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

      {paymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
