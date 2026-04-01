import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IStaffsPayments } from '@/api/staffs-payments/types';

export const clientsColumns: ColumnType<IStaffsPayments>[] = [
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
    title: 'Xodim',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.user?.fullname}</p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.user?.phone}</p>
      </div>
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'To\'lov qiymati',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{priceFormat(record?.sum)}</span>,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{record?.description}</span>,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'To\'lov vaqti',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{getFullDateFormat(record?.createdAt)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action staffsPayment={record} />,
  },
];
