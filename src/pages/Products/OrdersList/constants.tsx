import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IOrder, IOrderProducts, IOrderStatus, ITotalOrderPaymentCalc } from '@/api/order/types';
import { Image, Tag } from 'antd';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { priceFormat } from '@/utils/priceFormat';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { PaymentStatus } from './PaymentStatus';
import { currencyTagUi } from '@/constants/payment';
import { imageUrlWithBase } from '@/utils/image';
import { OrderDescUpdate } from './OrderDescUpdate/OrderDescUpdate';

export const ordersColumns: ColumnType<IOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '100px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Mijoz',
    align: 'center',
    width: '300px',
    render: (value, record) => <ClientNameLink client={record?.client} />,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Sotuv holati',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[record?.status]}
      >
        {OrderStatus[record?.status]}
      </Tag>
    ),
  },
  {
    key: 'payment',
    dataIndex: 'payment',
    title: 'To\'lov holati',
    align: 'center',
    width: '150px',
    render: (value, record) => <PaymentStatus order={record} />,
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    width: '100px',
    render: (value, record) => <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>,
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => {
      const data = record?.totalPrices;

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
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.date),
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
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    width: '150px',
    render: (value, record) => <Action orders={record} />,
  },
];

export const PRICE_TYPE_OPTIONS = [
  { label: 'Sotib olingan narx', value: 'cost' },
  { label: 'Ulgurji narx', value: 'wholesale' },
  { label: 'Sotish narxi', value: 'selling' },
];

export const OrderStatus: Record<IOrderStatus, string> = {
  [IOrderStatus.ACCEPTED]: 'Tasdiqlangan',
  [IOrderStatus.NOTACCEPTED]: 'Tasdiqlanmagan',
};

export const OrderStatusColor: Record<IOrderStatus, string> = {
  [IOrderStatus.ACCEPTED]: '#178c03',
  [IOrderStatus.NOTACCEPTED]: '#ff7700',
};

export const ordersInfoColumns: ColumnType<IOrder>[] = [
  {
    key: 'articl',
    dataIndex: 'articl',
    title: 'Sotuv raqami',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.articl,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Mijoz',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.client?.fullname}</p>
        <i>+{record?.client?.phone}</i>
      </div>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.staff?.fullname}</p>
        <i>+{record?.staff?.phone}</i>
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Sotuv holati',
    align: 'center',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[record?.status]}
      >
        {OrderStatus[record?.status]}
      </Tag>
    ),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.date),
  },
];


export const ordersInfoPaymentColumns: ColumnType<IOrder>[] = [
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => {
      const data = record?.totalPrices;

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

export const ordersInfoProductsColumns: ColumnType<IOrderProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 100,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'image',
    dataIndex: 'image',
    title: 'Mahsulot rasmi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <Image
        width={50}
        alt="basic"
        src={imageUrlWithBase(record?.product?.image)}
      />
    ),
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
    title: 'Sotish narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <span>{priceFormat(record?.prices?.selling?.price)}{currencyTagUi(record?.prices?.selling?.currency?.symbol)}</span>
    ),
  },
  {
    key: 'total',
    dataIndex: 'total',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      <span>{priceFormat(record?.prices?.selling?.totalPrice)}{currencyTagUi(record?.prices?.selling?.currency?.symbol)}</span>
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'O\'ram haqida ma\'lumot',
    align: 'center',
    width: 300,
    render: (value, record) => <span>{record?.product?.description}</span>,
  },
];


export const ordersTotalCalc: ColumnType<ITotalOrderPaymentCalc>[] = [
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalPrice),
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
    key: 'debt',
    dataIndex: 'debt',
    title: 'Jami - Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalDebt),
  },
];

export const FilterOrderStatusOptions = [
  {
    value: IOrderStatus.ACCEPTED,
    label: (
      <Tag
        color={OrderStatusColor[IOrderStatus.ACCEPTED]}
        style={{ width: '100%', fontSize: '14px' }}
      >
        {OrderStatus[IOrderStatus.ACCEPTED]}
      </Tag>
    ),
  },
  {
    value: IOrderStatus.NOTACCEPTED,
    label: (
      <Tag
        color={OrderStatusColor[IOrderStatus.NOTACCEPTED]}
        style={{ width: '100%', fontSize: '14px' }}
      >
        {OrderStatus[IOrderStatus.NOTACCEPTED]}
      </Tag>
    ),
  },
];
