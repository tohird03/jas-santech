import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IClientDeed, IClientDeedAction, IClientDeedType } from '@/api/clients';
import { Tag, Tooltip } from 'antd';
import { currencyTagUi } from '@/constants/payment';

export const deedColumns: ColumnType<IClientDeed>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 56,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: 'Vaqti',
    align: 'center',
    width: 168,
    render: (value, record) => getFullDateFormat(record?.date),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    align: 'center',
    width: 120,
    render: (value, record) => <Tag color={clientDeedActionColor[record?.action]}>{clientDeedAction[record?.action]}</Tag>,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Debet',
    align: 'center',
    width: 160,
    className: 'green-col',
    render: (value, record) => (
      record?.type === IClientDeedType.DEBIT
        ? (
          record?.values?.map(debt => (
            <p style={{margin: 0}} key={debt?.currency?.id}>
              {priceFormat(debt?.amount)}
              {currencyTagUi(debt?.currency?.symbol)}
            </p>
          ))
        )
        : null
    ),
  },
  {
    key: 'credit',
    dataIndex: 'credit',
    title: 'Kredit',
    align: 'center',
    width: 160,
    className: 'red-col',
    render: (value, record) => (
      record?.type === IClientDeedType.KREDIT
        ? (
          record?.values?.map(debt => (
            <p style={{margin: 0}} key={debt?.currency?.id}>
              {priceFormat(debt?.amount)}
              {currencyTagUi(debt?.currency?.symbol)}
            </p>
          ))
        )
        : null
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: 220,
    className: 'deed-note',
    render: (value, record) => {
      const description = record?.description || '';

      if (!description) {
        return null;
      }

      return (
        <Tooltip title={description} placement="topLeft">
          <span className="cell-ellipsis">{description}</span>
        </Tooltip>
      );
    },
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
