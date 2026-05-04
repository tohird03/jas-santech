import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IIncomeOrder, IIncomeProduct, ITotalIncomeOrderPaymentCalc } from '@/api/income-products/types';
import { priceFormat } from '@/utils/priceFormat';
import { SupplierNameLink } from '@/pages/ActionComponents/SupplierNameLink';
import { PaymentStatus } from './PaymentStatus';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { currencyTagUi } from '@/constants/payment';
import { OrderDescUpdate } from './OrderDescUpdate/OrderDescUpdate';

export const incomeOrdersColumns: ColumnType<IIncomeOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '120px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'supplier',
    dataIndex: 'supplier',
    title: 'Yetkazib beruvchi',
    align: 'center',
    width: '300px',
    render: (value, record) => <SupplierNameLink supplier={record?.supplier} />,
  },
  {
    key: 'staff',
    dataIndex: 'staff',
    title: 'Qabul qiluvchi',
    align: 'center',
    width: '120px',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>
      </div>
    ),
  },
  {
    key: 'paymentShow',
    dataIndex: 'paymentShow',
    title: 'To\'lov holat',
    align: 'center',
    width: '150px',
    render: (value, record) => <PaymentStatus incomeOrder={record} />,
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => {
      const data = record?.totalPrices?.cost;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '120px',
    render: (value, record) => {
      const data = record?.totalPayments;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '130px',
    render: (value, record) => {
      const data = record?.debtByCurrency;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.amount)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: '200px',
    render: (value, record) => <OrderDescUpdate order={record} />,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Tushurilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.date),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    width: '120px',
    render: (value, record) => <Action order={record} />,
  },
];

export const ordersInfoColumns: ColumnType<IIncomeOrder>[] = [
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Yetkazib beruvchi',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.supplier?.fullname}</p>
        <i>+{record?.supplier?.phone}</i>
      </div>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Ma\'sul xodim',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>
        <i>+{record?.staff?.phone}</i>
      </div>
    ),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'totalCost',
    dataIndex: 'totalCost',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <>
        {record?.totalPrices?.cost?.map(price =>
          <div key={price?.currencyId}>{priceFormat(price?.total)}{currencyTagUi(price?.currency?.symbol)}</div>)}
      </>
    ),
  },
];


export const ordersInfoPaymentColumns: ColumnType<IIncomeOrder>[] = [
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => {
      const data = record?.totalPrices?.cost;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '120px',
    render: (value, record) => {
      const data = record?.totalPayments;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '130px',
    render: (value, record) => {
      const data = record?.debtByCurrency;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <div key={price?.currency?.id}>
              {priceFormat(price?.amount)}
              {currencyTagUi(price?.currency?.symbol)}
            </div>
          ))}
        </>
      );
    },
  },
];

export const ordersInfoProductsColumns: ColumnType<IIncomeProduct>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 100,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mahsulot nomi',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.product?.name,
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Soni',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.count,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotib olish narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.cost?.totalPrice)}
        {currencyTagUi(record?.prices?.cost?.currency?.symbol)}
      </span>
    ),
  },
  {
    key: 'total',
    dataIndex: 'total',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.cost?.totalPrice)}
        {currencyTagUi(record?.prices?.cost?.currency?.symbol)}
      </span>
    ),
  },
];

export const incomeOrdersTotalCalc: ColumnType<ITotalIncomeOrderPaymentCalc>[] = [
  {
    key: 'totalCost',
    dataIndex: 'totalCost',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalCost),
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalPayment),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Jami - Naqd to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalCashPayment),
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Jami - Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalCardPayment),
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Jami - Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalTransferPayment),
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Jami - Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalOtherPayment),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Jami - Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalDebt),
  },
];
