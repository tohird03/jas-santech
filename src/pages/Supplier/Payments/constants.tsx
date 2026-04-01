import React from 'react';
import {ColumnType} from 'antd/es/table';
import {Action} from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISupplierPayments } from '@/api/payment-income/types';
import { SupplierNameLink } from '@/pages/ActionComponents/SupplierNameLink';

export const paymentsColumns: ColumnType<ISupplierPayments>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Yetkazib beruvchi',
    align: 'center',
    render: (value, record) => <SupplierNameLink supplier={record?.user} />,
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.cash),
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.card),
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.transfer),
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.other),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'To\'lov vaqti',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action supplierPayment={record} />,
  },
];
