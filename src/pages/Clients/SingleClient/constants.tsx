import React from 'react';
import {Orders} from '@/pages/Products';
import {ISingleClientTabs} from '@/stores/clients';
import {ClientsPayments} from '../Payments';
import {Deed} from './Deed';

export const singleClientTabOptions = [
  {
    value: ISingleClientTabs.ORDER,
    label: 'Mijozning xaridlari',
  },
  {
    value: ISingleClientTabs.PAYMENT,
    label: 'Mijozning to\'lovlari',
  },
  {
    value: ISingleClientTabs.DEED,
    label: 'Solishtirish dalolatnomalari',
  },
];

export const SegmentComponents: Record<ISingleClientTabs, any> = {
  [ISingleClientTabs.ORDER]: <Orders />,
  [ISingleClientTabs.PAYMENT]: <ClientsPayments />,
  [ISingleClientTabs.DEED]: <Deed />,
};
