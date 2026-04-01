import React from 'react';
import { ISingleClientTabs } from '@/stores/clients';
import { Payments } from './Payment';
import { Orders } from '@/pages/Products';
import { Deed } from './Deed';

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
  [ISingleClientTabs.PAYMENT]: <Payments />,
  [ISingleClientTabs.DEED]: <Deed />,
};
