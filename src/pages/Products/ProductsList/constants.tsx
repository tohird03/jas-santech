import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IProducts } from '@/api/product/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { priceFormat } from '@/utils/priceFormat';
import { NavLink } from 'react-router-dom';
import { currencyTagUi } from '@/constants/payment';
import { Image, Tooltip } from 'antd';
import { imageUrlWithBase } from '@/utils/image';

const unitTitle = (label: string) => (
  <span className="unit-head">
    {label}
    <span className="unit-head__unit">dona</span>
  </span>
);

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
    render: (value, record) => (
      <div className="person-link product-card" style={{ cursor: 'default' }}>
        <NavLink to={`/products/${record?.id}`} className="person-link__name">
          {record?.name}
        </NavLink>
        {record?.description ? (
          <Tooltip title={record.description}>
            <p className="person-link__phone">{record.description}</p>
          </Tooltip>
        ) : null}
      </div>
    ),
  },
  {
    key: 'image',
    dataIndex: 'image',
    title: 'Mahsulot rasmi',
    align: 'center',
    width: 72,
    render: (value, record) => (
      <Image
        width={32}
        height={32}
        alt="basic"
        style={{ objectFit: 'cover', borderRadius: 4 }}
        src={imageUrlWithBase(record?.image)}
      />
    ),
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: unitTitle('Qoldiq'),
    align: 'center',
    width: 100,
    render: (value, record) => {
      const low = (record?.count ?? 0) >= 0 && (record?.count ?? 0) < (record?.minAmount ?? 0);
      const tone = (record?.count ?? 0) < 0 ? 'stock-num stock-num--out' : low ? 'stock-num stock-num--low' : 'stock-num';

      return <span className={tone}>{record?.count}</span>;
    },
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotib olingan narxi',
    align: 'center',
    width: 120,
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
    width: 120,
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
    width: 120,
    render: (value, record) => (
      <span>
        {priceFormat(record?.prices?.selling?.price)} {currencyTagUi(record?.prices?.selling?.currency?.symbol)}
      </span>
    ),
  },
  {
    key: 'min_amount',
    dataIndex: 'min_amount',
    title: unitTitle('Ogohlantirish'),
    align: 'center',
    width: 100,
    render: (value, record) => record?.minAmount,
  },
  {
    key: 'category',
    dataIndex: 'category',
    title: 'Skladi',
    align: 'center',
    render: (value, record) => record?.category?.name,
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
    title: 'Amallar',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
