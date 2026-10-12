import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {DownloadOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Table, Tooltip, Typography} from 'antd';
import classNames from 'classnames';
import {productsApi} from '@/api/product/product';
import {IProducts} from '@/api/product/types';
import {DataTable} from '@/components/Datatable/datatable';
import {authStore} from '@/stores/auth';
import {productsListStore} from '@/stores/products';
import {addNotification} from '@/utils';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {AddEditModal} from './AddEditModal';
import {productsListColumn} from './constants';
import styles from './product-list.scss';

const cn = classNames.bind(styles);

export const ProductsList = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const {data: productsData, isLoading: loading} = useQuery({
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
    record.count < 0 ? 'stock-out'
      : record.count < record?.minAmount
        ? 'stock-low' : '';

  return (
    <main className="products-list-page">
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
              Excelga yuklash
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

      {isMobile ? (
        <>
          <div className={cn('products-list__total')}>
            <div>
              <span>Jami qoldiq</span>
              <b>{productsData?.data?.calc?.calcTotal?.totalCount || 0}</b>
            </div>
            <div>
              <span>Sotib olingan</span>
              <b>{priceFormat(productsData?.data?.calc?.calcTotal?.totalCost)}</b>
            </div>
            <div>
              <span>Ulgurji</span>
              <b>{priceFormat(productsData?.data?.calc?.calcTotal?.totalWholesale)}</b>
            </div>
            <div>
              <span>Sotilish</span>
              <b>{priceFormat(productsData?.data?.calc?.calcTotal?.totalPrice)}</b>
            </div>
            {authStore?.staffInfo?.role === 'super_admin' && (
              <div>
                <span>Tannarx jami</span>
                <b>
                  {priceFormat(productsData?.data?.data?.reduce((cur, prev) => cur + prev?.prices?.cost?.price * prev?.count, 0))}
                </b>
              </div>
            )}
          </div>
          <DataTable
            className="products-list__cards"
            isMobile
            columns={productsListColumn}
            data={productsData?.data?.data || []}
            loading={loading}
            rowClassName={rowClassName}
            pagination={{
              total: productsData?.data?.totalCount,
              current: productsListStore?.pageNumber,
              pageSize: productsListStore?.pageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(productsData?.data?.totalCount),
            }}
          />
        </>
      ) : (
        <Table
          columns={productsListColumn}
          dataSource={productsData?.data?.data || []}
          loading={loading}
          rowClassName={rowClassName}
          bordered
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
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1} align="center">
                <span style={{fontWeight: 600, color: '#262626'}}>Jami</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
              <Table.Summary.Cell index={3} align="center">
                <span style={{fontWeight: 600}}>{productsData?.data?.calc?.calcTotal?.totalCount || 0}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                <span style={{fontWeight: 600}}>{priceFormat(productsData?.data?.calc?.calcTotal?.totalCost)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center">
                <span style={{fontWeight: 600}}>{priceFormat(productsData?.data?.calc?.calcTotal?.totalWholesale)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                <span style={{fontWeight: 600}}>{priceFormat(productsData?.data?.calc?.calcTotal?.totalPrice)}</span>
              </Table.Summary.Cell>
              {authStore?.staffInfo?.role === 'super_admin' ? (
                <Table.Summary.Cell index={7} align="center">
                  <span style={{fontWeight: 600}}>
                    {priceFormat(productsData?.data?.data?.reduce((cur, prev) => cur + prev?.prices?.cost?.price * prev?.count, 0))}
                  </span>
                </Table.Summary.Cell>
              ) : <Table.Summary.Cell index={7} />}
              <Table.Summary.Cell index={8} />
              <Table.Summary.Cell index={9} />
              <Table.Summary.Cell index={10} />
              <Table.Summary.Cell index={11} />
            </Table.Summary.Row>
          )}
        />
      )}

      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
