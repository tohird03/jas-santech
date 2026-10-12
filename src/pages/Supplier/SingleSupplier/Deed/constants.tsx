import React from 'react';
import {Tag, Tooltip} from 'antd';
import {ColumnType} from 'antd/es/table';
import {ISupplierDeed, ISupplierDeedAction, ISupplierDeedType} from '@/api/supplier/types';
import {currencyTagUi} from '@/constants/payment';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';

export const deedColumns: ColumnType<ISupplierDeed>[] = [
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
    render: (value, record) => <Tag color={supplierDeedActionColor[record?.action]}>{supplierDeedAction[record?.action]}</Tag>,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Debet',
    align: 'center',
    width: '50px',
    className: 'green-col',
    render: (value, record) => (
      record?.type === ISupplierDeedType.DEBIT
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
    key: 'data',
    dataIndex: 'data',
    title: 'Kredit',
    align: 'center',
    width: '50px',
    className: 'red-col',
    render: (value, record) => (
      record?.type === ISupplierDeedType.KREDIT
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
    width: '200px',
    render: (value, record) => (
      record?.description ? (
        <Tooltip
          title={record.description}
          placement="topLeft"
          mouseEnterDelay={0}
          zIndex={3000}
          getPopupContainer={() => document.body}
        >
          <div className="clip-box">
            <span className="cell-ellipsis">{record.description}</span>
          </div>
        </Tooltip>
      ) : null
    ),
  },
];

const supplierDeedAction: Record<ISupplierDeedAction, string> = {
  [ISupplierDeedAction.PAYMENT]: 'To\'lov',
  [ISupplierDeedAction.ARRIVAL]: 'Tushum',
};

const supplierDeedActionColor: Record<ISupplierDeedAction, string> = {
  [ISupplierDeedAction.PAYMENT]: '#1890ff',
  [ISupplierDeedAction.ARRIVAL]: '#13c2c2',
};
