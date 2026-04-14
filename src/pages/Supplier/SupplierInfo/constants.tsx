import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { priceFormat } from '@/utils/priceFormat';
import { dateFormatterWithStringMonth } from '@/utils/dateFormat';
import { SupplierNameLink } from '@/pages/ActionComponents/SupplierNameLink';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISupplierDebtFilter, ISupplierInfo } from '@/api/supplier/types';
import { currencyTagUi } from '@/constants/payment';

export const supplierColumns: ColumnType<ISupplierInfo>[] = [
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
    title: 'Yetkazib beruvchi',
    align: 'center',
    render: (value, record) => <SupplierNameLink supplier={record} />,
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
    title: 'Yetkazib beruvchiga qarz',
    align: 'center',
    render: (value, record) => (
      record?.debtByCurrency?.length > 0
        ? record?.debtByCurrency?.map(debt => (
          <span key={debt?.currency?.id}>{debt?.amount}{currencyTagUi(debt?.currency?.symbol)}</span>
        )) : 0
    ),
  },
  {
    key: 'lastSale',
    dataIndex: 'lastSale',
    title: 'Oxirgi xarid',
    align: 'center',
    render: (value, record) => record?.lastArrivalDate ? getFullDateFormat(record?.lastArrivalDate) : null,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action supplier={record} />,
  },
];

export const supplierDebtFilter = [
  {
    value: null,
    label: 'Hamma mijozlar',
  },
  {
    value: ISupplierDebtFilter.EQUAL,
    label: '* ga teng bo\'lganlari',
  },
  {
    value: ISupplierDebtFilter.LESS,
    label: '* dan kam bo\'lganlari',
  },
  {
    value: ISupplierDebtFilter.GREATER,
    label: '* dan yuqori bo\'lganlari',
  },
];
