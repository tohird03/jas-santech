import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, InputNumber, Select, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { resizableTableProps, useResizableColumns } from '@/components/Datatable/use-resizable-columns';
import { clientsInfoStore } from '@/stores/clients';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './client-info.scss';
import { clientDebtFilter, clientsColumns } from './constants';
import { IClientDebtFilter, IClientsInfo, clientsInfoApi } from '@/api/clients';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { ordersStore } from '@/stores/products';
import { homeStore } from '@/stores/home/home';
import { currencyTagUi } from '@/constants/payment';

const cn = classNames.bind(styles);

const clientColumnKeys = ['index', 'name', 'phone', 'debt', 'isActiveBot', 'lastSale', 'action'];
const clientColumnTitles = [
  { key: 'index', title: '#' },
  { key: 'name', title: 'Mijoz' },
  { key: 'phone', title: 'Telefon raqami' },
  { key: 'debt', title: 'Mijoz qarzi' },
  { key: 'isActiveBot', title: 'Telegram bot' },
  { key: 'lastSale', title: 'Oxirgi sotuv' },
  { key: 'action', title: 'Amallar' },
];
const clientDefaultWidths = {
  index: 64,
  name: 320,
  phone: 180,
  debt: 220,
  isActiveBot: 130,
  lastSale: 180,
  action: 120,
};
const clientMinWidths = {
  index: 56,
  name: 160,
  phone: 140,
  debt: 140,
  isActiveBot: 110,
  lastSale: 140,
  action: 112,
};

export const ClientsInfo = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const { boxRef, apply, picker } = useResizableColumns({
    keys: clientColumnKeys,
    defaults: clientDefaultWidths,
    mins: clientMinWidths,
    titles: clientColumnTitles,
  });
  const columns = apply(clientsColumns);

  const { data: clientsInfoData, isLoading: loading } = useQuery({
    queryKey: [
      'getClients',
      clientsInfoStore.pageNumber,
      clientsInfoStore.pageSize,
      clientsInfoStore.search,
      clientsInfoStore.debt,
      clientsInfoStore.debtType,
    ],
    queryFn: () =>
      clientsInfoStore.getClients({
        pageNumber: clientsInfoStore.pageNumber,
        pageSize: clientsInfoStore.pageSize,
        search: clientsInfoStore.search!,
        debtValue: clientsInfoStore.debt || 0,
        debtType: clientsInfoStore.debtType!,
      }),
  });

  const { data: ordersStatisticData } = useQuery({
    queryKey: ['getOrdersStatistic'],
    queryFn: () => homeStore.getOrdersStatistic(),
  });

  const handleAddNewClient = () => {
    clientsInfoStore.setIsOpenAddEditClientModal(true);
  };

  const handleDebtValueChange = (value: number | null) => {
    clientsInfoStore.setDebt(value);
  };

  const handleDebtFilterChange = (value: IClientDebtFilter) => {
    clientsInfoStore.setDebtType(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clientsInfoStore.setSearch(e.currentTarget?.value);
    handlePageChange(1, 100);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    clientsInfoStore.setPageNumber(page);
    clientsInfoStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    clientsInfoStore.reset();
  }, []);

  const rowClassName = (record: IClientsInfo) =>
    record.debtByCurrency[0]?.amount > 0 ? 'error__row'
      : record.debtByCurrency[0]?.amount < 0
        ? 'info__row' : '';

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    clientsInfoApi.getUploadClients({
      pageNumber: clientsInfoStore.pageNumber,
      pageSize: clientsInfoStore.pageSize,
      search: clientsInfoStore.search!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'mijozlar.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  return (
    <main ref={boxRef}>
      <div className={cn('client-info__head')}>
        <Typography.Title level={3} className={cn('client-info__title')}>Mijozlar</Typography.Title>
        <div className={cn('client-info__filter')}>
          <Typography.Title level={3} className={cn('client-info__debt')}>
            Jami qarz:
            {ordersStatisticData?.clientDebtByCurrency?.map(clientDebt => (
              <span key={clientDebt?.currency?.id}>
                {priceFormat(clientDebt?.theirDebt)}
                {currencyTagUi(clientDebt?.currency?.symbol)}
              </span>
            ))}
          </Typography.Title>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('client-info__search')}
          />
          <InputNumber
            placeholder="Qarz miqdorini kiriting"
            onChange={handleDebtValueChange}
            style={{ width: 460 }}
            defaultValue={0}
            addonAfter={
              <Select
                options={clientDebtFilter}
                onChange={handleDebtFilterChange}
                style={{ width: '240px' }}
                placeholder="Hammasi"
                value={clientsInfoStore.debtType}
              />
            }
          />
          <div className={cn('client-info__actions')}>
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
              Mijoz qo&apos;shish
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        className={resizableTableProps.className}
        columns={columns}
        tableLayout={resizableTableProps.tableLayout}
        components={resizableTableProps.components}
        data={clientsInfoData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        rowClassName={rowClassName}
        pagination={{
          total: clientsInfoData?.data?.totalCount,
          current: clientsInfoStore?.pageNumber,
          pageSize: clientsInfoStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.data?.totalCount),
        }}
      />

      {clientsInfoStore.isOpenAddEditClientModal && <AddEditModal />}
    </main>
  );
});
