import React from 'react';
import {ColumnType} from 'antd/es/table';
import {Action} from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { IReturnedOrder, IReturnedOrderProducts } from '@/api/returned-order/types';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { Tag } from 'antd';
import { OrderStatus, OrderStatusColor } from '../OrdersList/constants';
import { getFullDateFormat } from '@/utils/getDateFormat';

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
    render: (value, record) => <ClientNameLink client={record?.client} />,
  },
  {
    key: 'sum',
    dataIndex: 'sum',
    title: 'Jami narxi',
    align: 'center',
    render: (value, record) => priceFormat(record?.totalPrice),
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
    key: 'fromClient',
    dataIndex: 'fromClient',
    title: 'Mijozning hisobidan',
    align: 'center',
    render: (value, record) => priceFormat(record?.payment?.fromBalance),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    render: (value, record) => priceFormat(record?.payment?.cash),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>
        <i>+{record?.staff?.phone}</i>
      </div>
    ),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Qaytarilgan sanasi',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.returnedDate),
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
    render: (value, record) => record?.product?.name,
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
