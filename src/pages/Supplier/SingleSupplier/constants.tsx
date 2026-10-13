import React from 'react';
import {IncomeProducts} from '@/pages/Products';
import {ISingleSupplierTabs} from '@/stores/supplier';
import {SupplierPayments} from '../Payments';
import {Deed} from './Deed';

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
