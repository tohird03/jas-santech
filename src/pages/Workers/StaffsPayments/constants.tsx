import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { Action } from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IStaffsPayments } from '@/api/staffs-payments/types';
import { currencyTagUi } from '@/constants/payment';
import styles from './staffs-payments.scss';

const cn = classNames.bind(styles);

export const clientsColumns: ColumnType<IStaffsPayments>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 64,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Xodim',
    align: 'center',
    width: 440,
    render: (value, record) => {
      const phone = record?.employee?.phone || '';
      const phoneText = !phone || phone.startsWith('+') ? phone : `+${phone}`;

      return (
        <div className={cn('staff-payment__person')}>
          <p className={cn('staff-payment__name')}>{record?.employee?.fullname}</p>
          {phoneText ? <p className={cn('staff-payment__phone')}>{phoneText}</p> : null}
        </div>
      );
    },
  },
  {
    key: 'amount',
    dataIndex: 'description',
    title: 'To\'lov qiymati',
    align: 'center',
    width: 300,
    render: (value, record) => (
      <span className="currency-row">
        {record?.methods?.map(method => (
          <span className="currency-item" key={method?.currency?.id}>{priceFormat(method?.amount)}{currencyTagUi(method?.currency?.symbol)}</span>
        ))}
      </span>
    ),
  },
  {
    key: 'note',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: 280,
    onCell: () => ({ style: { maxWidth: 0 } }),
    render: (value, record) => {
      const description = record?.description || '';

      if (!description) {
        return null;
      }

      return (
        <Tooltip title={description} placement="top">
          <span className={cn('staff-payment__note')}>{description}</span>
        </Tooltip>
      );
    },
  },
  {
    key: 'date',
    dataIndex: 'description',
    title: 'To\'lov vaqti',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{getFullDateFormat(record?.createdAt)}</span>,
  },
  {
    key: 'actions',
    dataIndex: 'action',
    title: 'Amallar',
    align: 'center',
    width: 120,
    render: (value, record) => <Action staffsPayment={record} />,
  },
];
