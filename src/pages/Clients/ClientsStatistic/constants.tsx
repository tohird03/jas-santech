import React from 'react';
import {ColumnsType} from 'antd/es/table';
import { IClientStatistic } from '@/api/clients';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { priceFormat } from '@/utils/priceFormat';

export const staffsWorkingTimeReportsColumns: ColumnsType<IClientStatistic> = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 20,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mijoz',
    align: 'center',
    width: 50,
    render: (value, record) => <ClientNameLink client={record} />,
  },
  {
    key: 'order',
    title: 'Sotuv',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#BFF5C0',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Jami',
        key: 'totalOrder',
        dataIndex: 'totalOrder',
        width: 50,
        className: 'client__order',
        render: (value, record) => priceFormat(record?.calc?.selling?.totalPrice || 0),
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Soni',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__order',
        render: (value, record) => record?.calc?.selling?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
  {
    key: 'order',
    title: 'To\'lov',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#BEE6FF',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Jami',
        key: 'totalOrder',
        dataIndex: 'totalOrder',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.total,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Soni',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Naqd',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.totalCash,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Bank kartasi',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.totalCard,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'O\'tkazma',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.totalTransfer,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Boshqa usullar',
        key: 'sellingCount',
        dataIndex: 'sellingCount',
        width: 50,
        className: 'client__payment',
        render: (value, record) => record?.calc?.selling?.payment?.totalOther,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
  {
    key: 'order',
    title: 'Qaytaruv',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#FFBDBD',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Jami',
        key: 'totalReturning',
        dataIndex: 'totalReturning',
        width: 50,
        className: 'client__returning',
        render: (value, record) => record?.calc?.returning?.totalPrice,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Soni',
        key: 'totalCount',
        dataIndex: 'totalCount',
        width: 50,
        className: 'client__returning',
        render: (value, record) => record?.calc?.returning?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mijoz hisobidan',
        key: 'totalFromBalance',
        dataIndex: 'totalFromBalance',
        width: 50,
        className: 'client__returning',
        render: (value, record) => record?.calc?.returning?.payment?.totalFromBalance,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Naqd',
        key: 'totalCash',
        dataIndex: 'totalCash',
        width: 50,
        className: 'client__returning',
        render: (value, record) => record?.calc?.returning?.payment?.totalCash,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
];
