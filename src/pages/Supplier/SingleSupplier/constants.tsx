import React from 'react';
import { Deed } from './Deed';
import { IncomeProducts } from '@/pages/Products';
import { ISingleSupplierTabs } from '@/stores/supplier';
import { SupplierPayments } from '../Payments';

export const singleSupplierTabOptions = [
  {
    value: ISingleSupplierTabs.ORDER,
    label: 'Yetkazib beruvchining kirimlari',
  },
  {
    value: ISingleSupplierTabs.PAYMENT,
    label: 'Yetkazib beruvchiga to\'lovlar',
  },
  {
    value: ISingleSupplierTabs.DEED,
    label: 'Solishtirish dalolatnomalari',
  },
];

export const SegmentComponents: Record<ISingleSupplierTabs, any> = {
  [ISingleSupplierTabs.ORDER]: <IncomeProducts />,
  [ISingleSupplierTabs.PAYMENT]: <SupplierPayments />,
  [ISingleSupplierTabs.DEED]: <Deed />,
};
