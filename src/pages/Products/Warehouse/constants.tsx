import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IProductWarehouse} from '@/api/warehouse/types';
import {Action} from './Action';

export const clientsColumns: ColumnType<IProductWarehouse>[] = [
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
    title: 'Nomi',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Amallar',
    align: 'center',
    render: (value, record) => <Action warehouse={record} />,
  },
];
