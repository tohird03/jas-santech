import { ColumnsType } from 'antd/es/table';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISingleProductStory } from '@/api/product/types';

export const singleProductColumns: ColumnsType<ISingleProductStory> = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '40px',
    render: (value, record, index) => index + 1,
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
        title: 'Mijoz',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.type === 'selling' ? record?.selling?.client?.fullname : null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 50,
        className: 'product-story__count',
        render: (value, record) => record?.type === 'selling' ? record?.count : null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Sotilgan vaqti',
        key: 'date',
        dataIndex: 'date',
        width: 100,
        render: (value, record) => record?.type === 'selling' ? getFullDateFormat(record?.createdAt) : null,
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
    title: 'Tushurilgan mahsulotlar',
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
        title: 'Yetkazib beruvchi',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.type === 'arrival' ? record?.arrival?.supplier?.fullname : null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 50,
        className: 'product-story__count',
        render: (value, record) => record?.type === 'arrival' ? record?.count: null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Olingan vaqti',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.type === 'arrival' ? getFullDateFormat(record?.createdAt) : null,
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
    title: 'Qaytgan mahsulotlar',
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
        title: 'Mijoz',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.type === 'returning' ? record?.returning?.client?.fullname : null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 50,
        className: 'product-story__count',
        render: (value, record) => record?.type === 'returning' ? record?.count : null,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Qaytarilgan vaqti',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.type === 'returning' ? getFullDateFormat(record?.createdAt) : null,
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
