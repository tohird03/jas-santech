import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IIncomeOrder, IIncomeProduct} from '@/api/income-products/types';
import {ClipText} from '@/components/ClipText';
import {currencyTagUi} from '@/constants/payment';
import {SupplierNameLink} from '@/pages/ActionComponents/SupplierNameLink';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';
import {OrderDescUpdate} from './OrderDescUpdate/OrderDescUpdate';
import {PaymentStatus} from './PaymentStatus';

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
    render: (value, record) => <SupplierNameLink supplier={record?.supplier} showPhone={false} clip />,
  },
  {
    key: 'staff',
    dataIndex: 'staff',
    title: 'Qabul qiluvchi',
    align: 'center',
    width: '120px',
    render: (value, record) => (
      <ClipText text={record?.staff?.fullname}>
        <div className="clip-box">
          <p className="cell-ellipsis" style={{margin: 0, fontWeight: 'bold'}}>{record?.staff?.fullname}</p>
        </div>
      </ClipText>
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
    render: (value, record) => {
      const data = record?.totalPrices?.cost;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    render: (value, record) => {
      const data = record?.totalPayments;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    render: (value, record) => {
      const data = record?.debtByCurrency;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.amount)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    title: 'Amallar',
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
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0'}}>
        <p style={{margin: 0, fontWeight: 'bold'}}>{record?.supplier?.fullname}</p>
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
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0'}}>
        <p style={{margin: 0, fontWeight: 'bold'}}>{record?.staff?.fullname}</p>
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
    render: (value, record) => (
      <>
        {record?.totalPrices?.cost?.map(price =>
          <span className="currency-item" key={price?.currencyId}>{priceFormat(price?.total)}{currencyTagUi(price?.currency?.symbol)}</span>)}
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
    render: (value, record) => {
      const data = record?.totalPrices?.cost;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    render: (value, record) => {
      const data = record?.totalPayments;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.total)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    render: (value, record) => {
      const data = record?.debtByCurrency;

      if (!data || data.length === 0) {
        return <div>0</div>;
      }

      return (
        <>
          {data.map(price => (
            <span className="currency-item" key={price?.currency?.id}>
              {priceFormat(price?.amount)}
              {currencyTagUi(price?.currency?.symbol)}
            </span>
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
    render: (value, record) => (
      <ClipText text={record?.product?.name}>
        <div className="clip-box">
          <span className="cell-ellipsis">{record?.product?.name}</span>
        </div>
      </ClipText>
    ),
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
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.cost?.totalPrice)}
        {currencyTagUi(record?.prices?.cost?.currency?.symbol)}
      </span>
    ),
  },
];
