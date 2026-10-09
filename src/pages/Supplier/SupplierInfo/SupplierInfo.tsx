import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, InputNumber, Select, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { resizableTableProps, useResizableColumns } from '@/components/Datatable/use-resizable-columns';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditSupplierModal } from './AddEditModal';
import styles from './supplier-info.scss';
import { supplierColumns, supplierDebtFilter } from './constants';
import { supplierInfoStore } from '@/stores/supplier';
import { ISupplierDebtFilter, ISupplierInfo } from '@/api/supplier/types';
import { supplierInfoApi } from '@/api/supplier/supplier';
import { addNotification } from '@/utils';

const cn = classNames.bind(styles);

const supplierColumnKeys = ['index', 'name', 'phone', 'debt', 'lastSale', 'action'];
const supplierColumnTitles = [
  { key: 'index', title: '#' },
  { key: 'name', title: 'Yetkazib beruvchi' },
  { key: 'phone', title: 'Telefon raqami' },
  { key: 'debt', title: 'Yetkazib beruvchiga qarz' },
  { key: 'lastSale', title: 'Oxirgi xarid' },
  { key: 'action', title: 'Amallar' },
];
const supplierDefaultWidths = {
  index: 64,
  name: 360,
  phone: 180,
  debt: 280,
  lastSale: 180,
  action: 120,
};
const supplierMinWidths = {
  index: 56,
  name: 160,
  phone: 140,
  debt: 160,
  lastSale: 140,
  action: 112,
};

export const SupplierInfo = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const { boxRef, apply, picker } = useResizableColumns({
    keys: supplierColumnKeys,
    defaults: supplierDefaultWidths,
    mins: supplierMinWidths,
    titles: supplierColumnTitles,
  });
  const columns = apply(supplierColumns);

  const { data: supplierData, isLoading: loading } = useQuery({
    queryKey: [
      'getSuppliers',
      supplierInfoStore.pageNumber,
      supplierInfoStore.pageSize,
      supplierInfoStore.search,
      supplierInfoStore.debt,
      supplierInfoStore.debtType,
    ],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: supplierInfoStore.pageNumber,
        pageSize: supplierInfoStore.pageSize,
        search: supplierInfoStore.search!,
        debtValue: supplierInfoStore.debt || 0,
        debtType: supplierInfoStore.debtType!,
      }),
  });

  const handleAddNewSupplier = () => {
    supplierInfoStore.setIsOpenAddEditSupplierModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierInfoStore.setSearch(e.currentTarget?.value);
  };

  const handleDebtValueChange = (value: number | null) => {
    supplierInfoStore.setDebt(value);
  };

  const handleDebtFilterChange = (value: ISupplierDebtFilter) => {
    supplierInfoStore.setDebtType(value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierInfoStore.setPageNumber(page);
    supplierInfoStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    supplierInfoApi.getUploadSupplier({
      pageNumber: supplierInfoStore.pageNumber,
      pageSize: supplierInfoStore.pageSize,
      search: supplierInfoStore.search!,
      debtValue: supplierInfoStore.debt || 0,
      debtType: supplierInfoStore.debtType!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'yetkazib beruvchilar.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const rowClassName = (record: ISupplierInfo) =>
    record.debtByCurrency[0]?.amount > 0 ? 'info__row'
      : record.debtByCurrency[0]?.amount < 0
        ? 'error__row' : '';

  useEffect(() => () => {
    supplierInfoStore.reset();
  }, []);

  return (
    <main ref={boxRef}>
      <div className={cn('supplier-info__head')}>
        <Typography.Title level={3}>Yetkazib beruvchilar ro&apos;yxati</Typography.Title>
        <div className={cn('supplier-info__filter')}>
          <Input
            placeholder="Yetkazib beruvchilarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('supplier-info__search')}
          />
          <InputNumber
            placeholder="Qarz miqdorini kiriting"
            onChange={handleDebtValueChange}
            style={{ width: 460 }}
            defaultValue={0}
            addonAfter={
              <Select
                options={supplierDebtFilter}
                onChange={handleDebtFilterChange}
                style={{ width: '240px' }}
                placeholder="Hammasi"
                value={supplierInfoStore.debtType}
              />
            }
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
            onClick={handleAddNewSupplier}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yetkazib beruvchi qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        className={resizableTableProps.className}
        columns={columns}
        tableLayout={resizableTableProps.tableLayout}
        components={resizableTableProps.components}
        data={supplierData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: supplierData?.data?.totalCount,
          current: supplierInfoStore?.pageNumber,
          pageSize: supplierInfoStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(supplierData?.data?.totalCount),
        }}
        rowClassName={rowClassName}
      />

      {supplierInfoStore.isOpenAddEditSupplierModal && <AddEditSupplierModal />}
    </main>
  );
});
