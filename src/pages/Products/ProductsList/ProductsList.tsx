import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { AddEditModal } from './AddEditModal';
import styles from './product-list.scss';
import { productsListColumn } from './constants';
import { productsListStore } from '@/stores/products';
import { IProducts } from '@/api/product/types';
import { priceFormat } from '@/utils/priceFormat';
import { authStore } from '@/stores/auth';
import { productsApi } from '@/api/product/product';
import { addNotification } from '@/utils';

const cn = classNames.bind(styles);

export const ProductsList = observer(() => {
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: productsData, isLoading: loading } = useQuery({
    queryKey: [
      'getProducts',
      productsListStore.pageNumber,
      productsListStore.pageSize,
      productsListStore.search,
    ],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: productsListStore.pageNumber,
        pageSize: productsListStore.pageSize,
        search: productsListStore.search!,
      }),
  });

  const handleAddNewProduct = () => {
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    productsListStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    productsListStore.setPageNumber(page);
    productsListStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    productsApi.getProductsToExcel({
      pageNumber: productsListStore.pageNumber,
      pageSize: productsListStore.pageSize,
      search: productsListStore.search!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'mahsulotlar.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  useEffect(() => () => {
    productsListStore.reset();
  }, []);

  const rowClassName = (record: IProducts) =>
    record.count < 0 ? 'error__row'
      : record.count < record?.minAmount
        ? 'warning__row' : '';

  return (
    <main>
      <div className={cn('product-list__head')}>
        <Typography.Title level={3}>Mahsulotlar</Typography.Title>
        <div className={cn('product-list__filter')}>
          <Input
            placeholder="Mahsulotni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('product-list__search')}
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
            onClick={handleAddNewProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mahsulot qo&apos;shish
          </Button>
        </div>
      </div>

      <Table
        columns={productsListColumn}
        dataSource={productsData?.data?.data || []}
        loading={loading}
        rowClassName={rowClassName}
        pagination={{
          total: productsData?.data?.totalCount,
          current: productsListStore?.pageNumber,
          pageSize: productsListStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(productsData?.data?.totalCount),
          pageSizeOptions: [50, 100, 500, 1000, 5000],
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Umumiy:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{productsData?.data?.calc?.calcTotal?.totalCount}</p>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                Umumiy sotib olingan narxi:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{priceFormat(productsData?.data?.calc?.calcTotal?.totalCost)}</p>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                Umumiy sotilish narxi:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{priceFormat(productsData?.data?.calc?.calcTotal?.totalPrice)}</p>
              </div>
            </Table.Summary.Cell>
            {authStore?.staffInfo?.role === 'super_admin' && (
              <Table.Summary.Cell index={3}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                  Umumiy qiymati:
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {priceFormat(productsData?.data?.data?.reduce((cur, prev) => cur + prev?.cost * prev?.count, 0))}
                  </p>
                </div>
              </Table.Summary.Cell>
            )
            }
          </Table.Summary.Row>
        )}
      />


      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
