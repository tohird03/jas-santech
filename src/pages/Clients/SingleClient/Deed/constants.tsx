import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IClientDeed, IClientDeedAction, IClientDeedType} from '@/api/clients';
import { Tag } from 'antd';

export const deedColumns: ColumnType<IClientDeed>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '40px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Vaqti',
    align: 'center',
    width: '100px',
    render: (value, record) => getFullDateFormat(record?.date),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    width: '50px',
    render: (value, record) => <Tag color={clientDeedActionColor[record?.action]}>{clientDeedAction[record?.action]}</Tag>,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Дебит',
    align: 'center',
    width: '100px',
    className: 'green-col',
    render: (value, record) => (
      record?.type === IClientDeedType.DEBIT
        ? priceFormat(record?.value)
        : null
    ),
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Кредит',
    align: 'center',
    width: '100px',
    className: 'red-col',
    render: (value, record) => (
      record?.type === IClientDeedType.KREDIT
        ? priceFormat(record?.value)
        : null
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: '200px',
    render: (value, record) => <span>{record?.description}</span>,
  },
];

const clientDeedAction: Record<IClientDeedAction, string> = {
  [IClientDeedAction.SELLING]: 'Sotuv',
  [IClientDeedAction.RETURNING]: 'Qaytaruv',
  [IClientDeedAction.PAYMENT]: 'To\'lov',
};

const clientDeedActionColor: Record<IClientDeedAction, string> = {
  [IClientDeedAction.SELLING]: '#52c41a',
  [IClientDeedAction.RETURNING]: '#faad14',
  [IClientDeedAction.PAYMENT]: '#1890ff',
};
