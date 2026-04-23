import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IProducts } from '@/api/product/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { priceFormat } from '@/utils/priceFormat';
import { NavLink } from 'react-router-dom';
import { currencyTagUi } from '@/constants/payment';
import { Image } from 'antd';
import { imageUrlWithBase } from '@/utils/image';

export const productsListColumn: ColumnType<IProducts>[] = [
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
    title: 'Mahsulot nomi',
    align: 'center',
    render: (value, record) => <NavLink to={`/products/${record?.id}`}>{record?.name}</NavLink>,
  },
  {
    key: 'image',
    dataIndex: 'image',
    title: 'Mahsulot rasmi',
    align: 'center',
    render: (value, record) => (
      <Image
        width={50}
        alt="basic"
        src={imageUrlWithBase(record?.image)}
      />
    ),
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Qoldiq',
    align: 'center',
    render: (value, record) => `${record?.count} dona`,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotib olingan narxi',
    align: 'center',
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.cost?.price)} {currencyTagUi(record?.prices?.cost?.currency?.symbol)}
      </span>
    ),
  },
  {
    key: 'wholePrice',
    dataIndex: 'wholePrice',
    title: 'Ulgurji narxi',
    align: 'center',
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.wholesale?.price)} {currencyTagUi(record?.prices?.wholesale?.currency?.symbol)}
      </span>
    ),
  },
  {
    key: 'selling_price',
    dataIndex: 'selling_price',
    title: 'Sotilish narxi',
    align: 'center',
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.selling?.price)} {currencyTagUi(record?.prices?.selling?.currency?.symbol)}
      </span>
    ),
  },
  {
    key: 'min_amount',
    dataIndex: 'min_amount',
    title: 'Ogohlantirish',
    align: 'center',
    render: (value, record) => `${record?.minAmount} dona`,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'O\'ram haqida ma\'lumot',
    align: 'center',
    width: 300,
    render: (value, record) => <span>{record?.description}</span>,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Yaratilgan vaqti',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
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
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
