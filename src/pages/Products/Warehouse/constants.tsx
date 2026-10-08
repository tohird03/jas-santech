import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IStaffsPayments } from '@/api/staffs-payments/types';
import { currencyTagUi } from '@/constants/payment';
import { ICurrency } from '@/api/auth/types';
import { IProductWarehouse } from '@/api/warehouse/types';

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
    render: (value, record, index) => record?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Amallar',
    align: 'center',
    render: (value, record) => <Action warehouse={record} />,
  },
];
