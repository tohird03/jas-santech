import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IReturnedOrder, IReturnedOrderProducts} from '@/api/returned-order/types';
import {ClipText} from '@/components/ClipText';
import {currencyTagUi} from '@/constants/payment';
import {ClientNameLink} from '@/pages/ActionComponents/ClientNameLink';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import {OrderStatus, OrderStatusColor} from '../OrdersList/constants';
import {Action} from './Action';

export const returnedOrdersColumns: ColumnType<IReturnedOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mijoz',
    align: 'center',
    onCell: () => ({style: {maxWidth: 280}}),
    render: (value, record) => <ClientNameLink client={record?.client} clip />,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Qaytaruv holati',
    align: 'center',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[record?.status!]}
      >
        {OrderStatus[record?.status!]}
      </Tag>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <ClipText text={record?.staff?.fullname}>
        <div className="clip-box">
          <p className="cell-ellipsis" style={{margin: 0, fontWeight: 'bold'}}>{record?.staff?.fullname}</p>
          <i>+{record?.staff?.phone}</i>
        </div>
      </ClipText>
    ),
  },
  {
    key: 'sum',
    dataIndex: 'sum',
    title: 'Jami narxi',
    align: 'center',
    render: (value, record) => (
      <>
        {record?.totalPrices?.map(price =>
          <span className="currency-item" key={price?.currencyId}>{priceFormat(price?.total)}{currencyTagUi(price?.currency?.symbol)}</span>)}
      </>
    ),
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    render: (value, record) => {
      const data = record?.totalPayments;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
          ))}
        </>
      );
    },
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    render: (value, record) => {
      const data = record?.debtByCurrency;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.amount)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
          ))}
        </>
      );
    },
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Qaytarilgan sanasi',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.date),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'O\'zgartirish',
    align: 'center',
    width: '150px',
    render: (value, record) => <Action returnedOrder={record} />,
  },
];

export const returnedOrdersInfoProductsColumns: ColumnType<IReturnedOrderProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 100,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mahsulot nomi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <ClipText text={record?.product?.name}>
        <div className="clip-box">
          <span className="cell-ellipsis">{record?.product?.name}</span>
        </div>
      </ClipText>
    ),
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Soni',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.count,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotish narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.price),
  },
  {
    key: 'total',
    dataIndex: 'total',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.count * record?.price),
  },
];
