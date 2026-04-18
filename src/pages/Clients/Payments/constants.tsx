import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IClientsInfo} from '@/api/clients';
import {Action} from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { IClientsPayments } from '@/api/payment/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { currencyTagUi } from '@/constants/payment';

export const paymentsColumns: ColumnType<IClientsPayments>[] = [
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
    title: 'Mijoz',
    align: 'center',
    render: (value, record) => <ClientNameLink client={record?.client} />,
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Jami to\'lov',
    align: 'center',
    render: (value, record) => (
      record?.totalsByCurrency?.map(payment => (
        <div key={payment?.currency?.id}>
          {priceFormat(payment?.total)}
          {currencyTagUi(payment?.currency?.symbol)}
        </div>
      ))
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    render: (value, record) => <span>{record?.description}</span>,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'To\'lov vaqti',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    width: 200,
    render: (value, record) => <Action clientPayment={record} />,
  },
];
