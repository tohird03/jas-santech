import React from 'react';
import { ColumnType } from 'antd/es/table';
import { IClientDebtFilter, IClientsInfo } from '@/api/clients';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { priceFormat } from '@/utils/priceFormat';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { Tag } from 'antd';

export const clientsColumns: ColumnType<IClientsInfo>[] = [
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
    render: (value, record) => <ClientNameLink client={record} />,
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Telefon raqami',
    align: 'center',
    render: (value, record) => `+${formatPhoneNumber(record?.phone)}`,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Mijoz qarzi',
    align: 'center',
    render: (value, record) => priceFormat(record?.debt),
    sorter: (a, b) => a?.debt - b?.debt,
  },
  {
    key: 'isActiveBot',
    dataIndex: 'isActiveBot',
    title: 'Telegram bot',
    align: 'center',
    render: (value, record) => (
      <Tag color={record?.telegram?.isActive ? '#228B22' : '#FF7F50'}>
        {record?.telegram?.isActive ? 'Active' : 'NoActive' }
      </Tag>
    ),
  },
  {
    key: 'lastSale',
    dataIndex: 'lastSale',
    title: 'Oxirgi sotuv',
    align: 'center',
    render: (value, record) => record?.lastSellingDate ? getFullDateFormat(record?.lastSellingDate) : null,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action client={record} />,
  },
];

export const clientDebtFilter = [
  {
    value: null,
    label: 'Hamma mijozlar',
  },
  {
    value: IClientDebtFilter.EQUAL,
    label: '* ga teng bo\'lganlari',
  },
  {
    value: IClientDebtFilter.LESS,
    label: '* dan kam bo\'lganlari',
  },
  {
    value: IClientDebtFilter.GREATER,
    label: '* dan yuqori bo\'lganlari',
  },
];
