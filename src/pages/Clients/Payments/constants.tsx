import React from 'react';
import {Tooltip} from 'antd';
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
    onCell: () => ({style: {maxWidth: 0}}),
    render: (value, record) => <ClientNameLink client={record?.client} plain clip />,
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Jami to\'lov',
    align: 'center',
    render: (value, record) => (
      <span className="currency-row">
        {record?.totalsByCurrency?.map(payment => (
          <span className="currency-item" key={payment?.currency?.id}>
            {priceFormat(payment?.total)}
            {currencyTagUi(payment?.currency?.symbol)}
          </span>
        ))}
      </span>
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    onCell: () => ({style: {maxWidth: 0}}),
    render: (value, record) => {
      const description = record?.description || '';

      if (!description) {
        return null;
      }

      return (
        <Tooltip title={description} placement="topLeft">
          <span className="cell-ellipsis">{description}</span>
        </Tooltip>
      );
    },
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
    onCell: () => ({style: {maxWidth: 0}}),
    render: (value, record) => {
      const fullname = record?.staff?.fullname || '';

      if (!fullname) {
        return null;
      }

      return (
        <Tooltip title={fullname} placement="topLeft">
          <span className="cell-ellipsis" style={{fontWeight: 'bold'}}>{fullname}</span>
        </Tooltip>
      );
    },
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Amallar',
    align: 'center',
    width: 200,
    render: (value, record) => <Action clientPayment={record} />,
  },
];
