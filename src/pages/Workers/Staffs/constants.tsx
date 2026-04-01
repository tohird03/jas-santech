import React from 'react';
import {ColumnType} from 'antd/es/table';
import {EPageAccess, IStaffs} from '@/api/staffs';
import {Action} from './Action';
import {formatPhoneNumber} from '@/utils/phoneFormat';

export const staffsColumns: ColumnType<IStaffs>[] = [
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
    title: 'Xodim',
    align: 'center',
    render: (value, record) => record?.fullname,
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Telefon raqami',
    align: 'center',
    render: (value, record) => `+${formatPhoneNumber(record?.phone)}`,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action staff={record} />,
  },
];

export const EPageAccessLabel: Record<EPageAccess, string> = {
  [EPageAccess.STAT]: 'Statistika sahifasi',
  [EPageAccess.PRODUCT]: 'Mahsulotlar ro\'yxati',
  [EPageAccess.SELLING]: 'Sotuvlar',
  [EPageAccess.ARRIVAL]: 'Tushurilgan mahsulotlar',
  [EPageAccess.RETURNING]: 'Qaytaruv',
  [EPageAccess.CLIENT]: 'Mijozlar',
  [EPageAccess.CLIENTPAYMENT]: 'Mijoz to\'lovlari',
  [EPageAccess.CLIENTSTATISTIC]: 'Mijozlar hisoboti',
  [EPageAccess.SUPPLIER]: 'Yetkazib beruvchilar',
  [EPageAccess.SUPPLIERPAYMENT]: 'Yetkazib beruvchilarga to\'lovlar',
  [EPageAccess.STUFF]: 'Xodimlar',
  [EPageAccess.STUFFPAYMENT]: 'Xodimlarga to\'lovlar',
};
