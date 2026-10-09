import React from 'react';
import { ColumnType } from 'antd/es/table';
import { IClientDebtFilter, IClientsInfo } from '@/api/clients';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { priceFormat } from '@/utils/priceFormat';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { Tooltip } from 'antd';
import { CheckCircleFilled, MinusOutlined } from '@ant-design/icons';
import { CurrencyAmountZero, currencyTagUi } from '@/constants/payment';

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
    render: (value, record) => <ClientNameLink client={record} rowHover />,
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
    render: (value, record) => (
      record?.debtByCurrency?.length > 0
        ? (
          <span className="currency-row">
            {record?.debtByCurrency?.map(debt => (
              <span className="currency-item" key={debt?.currency?.id}>{debt?.amount}{currencyTagUi(debt?.currency?.symbol)}</span>
            ))}
          </span>
        ) : <CurrencyAmountZero />),
  },
  {
    key: 'isActiveBot',
    dataIndex: 'isActiveBot',
    title: 'Telegram bot',
    align: 'center',
    render: (value, record) => {
      const active = Boolean(record?.telegram?.isActive);

      return (
        <Tooltip title={active ? 'Botda ro\'yxatdan o\'tgan' : 'Botda ro\'yxatdan o\'tmagan'}>
          {active
            ? <CheckCircleFilled className="bot-mark bot-mark--on" />
            : <MinusOutlined className="bot-mark" />}
        </Tooltip>
      );
    },
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
    title: 'Amallar',
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
