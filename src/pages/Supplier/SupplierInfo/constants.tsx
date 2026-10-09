import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { priceFormat } from '@/utils/priceFormat';
import { dateFormatterWithStringMonth } from '@/utils/dateFormat';
import { SupplierNameLink } from '@/pages/ActionComponents/SupplierNameLink';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISupplierDebtFilter, ISupplierInfo } from '@/api/supplier/types';
import { CurrencyAmountZero, currencyTagUi } from '@/constants/payment';

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
    render: (value, record) => <SupplierNameLink supplier={record} showPhone={false} rowHover />,
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
        ? (
          <span className="currency-row">
            {record?.debtByCurrency?.map(debt => (
              <span className="currency-item" key={debt?.currency?.id}>{priceFormat(debt?.amount)}{currencyTagUi(debt?.currency?.symbol)}</span>
            ))}
          </span>
        ) : <CurrencyAmountZero />
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
    title: 'Amallar',
    align: 'center',
    render: (value, record) => <Action supplier={record} />,
  },
];

export const supplierDebtFilter = [
  {
    value: null,
    label: 'Hammasi',
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
