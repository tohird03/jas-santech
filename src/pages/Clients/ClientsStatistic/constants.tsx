import React from 'react';
import {ColumnsType} from 'antd/es/table';
import {IClientStatistic, IReportAmount} from '@/api/clients';
import {CurrencyAmountZero, currencyTagUi} from '@/constants/payment';
import {ClientNameLink} from '@/pages/ActionComponents/ClientNameLink';
import {priceFormat} from '@/utils/priceFormat';

const headerCell = (className: string) => () => ({className});

const sellingHead = headerCell('report-head-selling');
const paymentHead = headerCell('report-head-payment');
const returnHead = headerCell('report-head-return');

const Amounts = ({rows}: {rows?: IReportAmount[]}) => {
  const filled = (rows || []).filter((row) => Number(row?.amount));

  if (!filled.length) {
    return <CurrencyAmountZero />;
  }

  return (
    <span className="currency-row">
      {filled.map((row) => {
        const symbol = row.currency?.symbol === 'USD' ? 'USD' : 'UZS';

        return (
          <span className="currency-item" key={`${row.currency?.id || symbol}-${row.amount}`}>
            {priceFormat(row.amount)}
            {currencyTagUi(symbol)}
          </span>
        );
      })}
    </span>
  );
};

export const staffsWorkingTimeReportsColumns: ColumnsType<IClientStatistic> = [
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
    dataIndex: 'fullname',
    title: 'Mijoz',
    align: 'center',
    width: 320,
    onCell: () => ({style: {maxWidth: 0}}),
    render: (value, record) => <ClientNameLink client={record} plain centered clip />,
  },
  {
    key: 'selling',
    title: 'Sotuv',
    align: 'center',
    onHeaderCell: sellingHead,
    children: [
      {
        title: 'Soni',
        key: 'sellingCount',
        width: 80,
        align: 'center',
        onHeaderCell: sellingHead,
        render: (value, record) => record?.calc?.selling?.count || 0,
      },
      {
        title: 'Summa',
        key: 'sellingSum',
        width: 180,
        align: 'right',
        onHeaderCell: sellingHead,
        render: (value, record) => <Amounts rows={record?.calc?.selling?.totalPriceByCurrency} />,
      },
    ],
  },
  {
    key: 'sellingPayment',
    title: 'Sotuv to\'lovi',
    align: 'center',
    onHeaderCell: paymentHead,
    children: [
      {
        title: 'Soni',
        key: 'sellingPaymentCount',
        width: 80,
        align: 'center',
        onHeaderCell: paymentHead,
        render: (value, record) => record?.calc?.selling?.paymentCount || 0,
      },
      {
        title: 'Summa',
        key: 'sellingPaymentSum',
        width: 180,
        align: 'right',
        onHeaderCell: paymentHead,
        render: (value, record) => <Amounts rows={record?.calc?.selling?.paymentByCurrency} />,
      },
    ],
  },
  {
    key: 'clientPayment',
    title: 'Alohida to\'lov',
    align: 'center',
    onHeaderCell: paymentHead,
    children: [
      {
        title: 'Soni',
        key: 'clientPaymentCount',
        width: 80,
        align: 'center',
        onHeaderCell: paymentHead,
        render: (value, record) => record?.calc?.clientPayment?.count || 0,
      },
      {
        title: 'Summa',
        key: 'clientPaymentSum',
        width: 180,
        align: 'right',
        onHeaderCell: paymentHead,
        render: (value, record) => <Amounts rows={record?.calc?.clientPayment?.totalByCurrency} />,
      },
    ],
  },
  {
    key: 'returning',
    title: 'Qaytaruv',
    align: 'center',
    onHeaderCell: returnHead,
    children: [
      {
        title: 'Soni',
        key: 'returningCount',
        width: 80,
        align: 'center',
        onHeaderCell: returnHead,
        render: (value, record) => record?.calc?.returning?.count || 0,
      },
      {
        title: 'To\'lov',
        key: 'returningSum',
        width: 180,
        align: 'right',
        onHeaderCell: returnHead,
        render: (value, record) => <Amounts rows={record?.calc?.returning?.paymentByCurrency} />,
      },
    ],
  },
  {
    key: 'debt',
    title: 'Qarz',
    width: 180,
    align: 'right',
    onHeaderCell: () => ({
      className: 'report-head-debt',
      rowSpan: 2,
    }),
    render: (value, record) => <Amounts rows={record?.calc?.debtByCurrency} />,
  },
];
