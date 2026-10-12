import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DatePicker, DatePickerProps, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/es/table';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import {ISingleProductStory} from '@/api/product/types';
import {DataTable} from '@/components/Datatable/datatable';
import {currencyTagUi} from '@/constants/payment';
import {incomeProductsStore, ordersStore, productsListStore, returnedOrdersStore} from '@/stores/products';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditIncomeOrderModal} from '../../IncomeProducts/AddEditModal';
import {AddEditModal} from '../../OrdersList/AddEditModal';
import {AddEditReturnedOrderModal} from '../../ReturnedOrders/AddEditModal';
import {singleProductColumns} from './constants';
import {ProductStoryClientName} from './ProductStoryName/ProductStoryName';
import styles from './single-product.scss';

const cn = classNames.bind(styles);

const storyTypeLabel: Record<ISingleProductStory['type'], string> = {
  selling: 'Sotuv',
  arrival: 'Tushum',
  returning: 'Qaytgan',
};

const storyPrice = (record: ISingleProductStory) => {
  const kind = record?.type === 'arrival' ? 'cost' : 'selling';
  const price = record?.prices?.find((item) => item.type === kind);

  if (!price) {
    return null;
  }

  return (
    <span>
      {price.price?.toLocaleString()}
      {' '}
      {currencyTagUi(price?.currency?.symbol)}
    </span>
  );
};

const mobileColumns: ColumnsType<ISingleProductStory> = [
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Turi',
    render: (value, record) => storyTypeLabel[record?.type],
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Nomi',
    render: (value, record) => (
      <ProductStoryClientName client={record} type={record?.type} />
    ),
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Soni',
    render: (value, record) => record?.count,
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Narx',
    render: (value, record) => storyPrice(record),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Vaqti',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
];

export const SingleProduct = observer(() => {
  const {productId} = useParams();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const storyCount = productsListStore?.singleProductStoryCount;

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      productsListStore.setStartDate(null);
    }
    productsListStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      productsListStore.setEndDate(null);
    }
    productsListStore.setEndDate(new Date(dateString));
  };

  useEffect(() => {
    if (productId) {
      setLoading(true);

      productsListStore.getSingleProductsCount({
        productId,
        startDate: productsListStore?.startDate!,
        endDate: productsListStore?.endDate!,
      });

      productsListStore.getSingleProductStory({
        productId,
        startDate: productsListStore?.startDate!,
        endDate: productsListStore?.endDate!,
      })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      productsListStore.setSingleProduct(null);
    };
  }, [productId, productsListStore.startDate, productsListStore.endDate]);

  return (
    <main className="single-product-page">
      <div className={cn('single-product__head')}>
        <div>
          <Typography.Title className={cn('single-product__name')} level={3}>
            {storyCount?.name}
          </Typography.Title>
          <Typography.Title className={cn('single-product__name')} level={4}>
            Qoldig&apos;i: {storyCount?.count}
          </Typography.Title>
        </div>
        <div className={cn('single-product__filter')}>
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(productsListStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(productsListStore.endDate)}
            allowClear={false}
          />
        </div>
      </div>

      {isMobile ? (
        <>
          <div className={cn('single-product__total')}>
            <div className={cn('total__order')}>
              <span>Jami sotuv</span>
              <b>{storyCount?.totalSellingCount}</b>
            </div>
            <div className={cn('total__arrival')}>
              <span>Jami tushum</span>
              <b>{storyCount?.totalArrivalCount}</b>
            </div>
            <div className={cn('total__returning')}>
              <span>Jami qaytgan</span>
              <b>{storyCount?.totalReturningCount}</b>
            </div>
            <div className={cn('total')}>
              <span>Umumiy qoldiq</span>
              <b>{storyCount?.actualCount}</b>
            </div>
          </div>
          <DataTable
            className="product-story-cards"
            isMobile
            columns={mobileColumns}
            data={productsListStore?.singleProductStory || []}
            loading={loading}
            pagination={false}
            rowClassName={(record: ISingleProductStory) => `product-story-card--${record?.type}`}
          />
        </>
      ) : (
        <Table
          columns={singleProductColumns}
          dataSource={productsListStore?.singleProductStory || []}
          bordered
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={1} index={0}>
                  Jami
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={4} index={1} className={cn('total__order')}>
                  <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {storyCount?.totalSellingCount}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4} className={cn('total__arrival')}>
                  <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {storyCount?.totalArrivalCount}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={4} className={cn('total__returning')}>
                  <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {storyCount?.totalReturningCount}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={1} index={0}>
                  Umumiy qoldiq
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={12} index={2} className={cn('total')}>
                  <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {storyCount?.actualCount}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
          pagination={false}
          loading={loading}
        />
      )}

      {ordersStore.isOpenAddEditNewOrderModal && <AddEditModal />}
      {returnedOrdersStore.isOpenAddEditReturnedOrderModal && <AddEditReturnedOrderModal />}
      {incomeProductsStore.isOpenAddEditIncomeProductsModal && <AddEditIncomeOrderModal />}
    </main>
  );
});
