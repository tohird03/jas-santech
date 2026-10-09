import React from 'react';
import { Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISupplierPayments } from '@/api/payment-income/types';
import { SupplierNameLink } from '@/pages/ActionComponents/SupplierNameLink';
import { currencyTagUi } from '@/constants/payment';

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
    onCell: () => ({ style: { maxWidth: 0 } }),
    render: (value, record) => <SupplierNameLink supplier={record?.supplier} plain clip />,
  },
  {
    key: 'totalPayment',
    dataIndex: 'totalPayment',
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
    onCell: () => ({ style: { maxWidth: 0 } }),
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
    key: 'action',
    dataIndex: 'action',
    title: 'Amallar',
    align: 'center',
    render: (value, record) => <Action supplierPayment={record} />,
  },
];
