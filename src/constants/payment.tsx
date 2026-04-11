import React from 'react';
import { Tag } from 'antd';
import { PaymentTypes } from './types';

export const orderPaymentType: Record<PaymentTypes, string> = {
  [PaymentTypes.CASH]: 'Naqd',
  [PaymentTypes.UZCARD]: 'Uzcard',
  [PaymentTypes.HUMO]: 'Humo',
  [PaymentTypes.CLICK]: 'Click',
  [PaymentTypes.PAYME]: 'Payme',
  [PaymentTypes.VISA]: 'Visa',
  [PaymentTypes.UZUM]: 'Uzum',
  [PaymentTypes.OTHER]: 'Boshqa usullar',
  [PaymentTypes.TRANSFER]: 'Bank o\'tkazmasi',
};

export const PaymentTypeOptions = [
  {
    value: PaymentTypes.CASH,
    label: PaymentTypes.CASH,
  },
  {
    value: PaymentTypes.CLICK,
    label: PaymentTypes.CLICK,
  },
  {
    value: PaymentTypes.HUMO,
    label: PaymentTypes.HUMO,
  },
  {
    value: PaymentTypes.OTHER,
    label: PaymentTypes.OTHER,
  },
  {
    value: PaymentTypes.PAYME,
    label: PaymentTypes.PAYME,
  },
  {
    value: PaymentTypes.TRANSFER,
    label: PaymentTypes.TRANSFER,
  },
  {
    value: PaymentTypes.UZCARD,
    label: PaymentTypes.UZCARD,
  },
  {
    value: PaymentTypes.UZUM,
    label: PaymentTypes.UZUM,
  },
  {
    value: PaymentTypes.VISA,
    label: PaymentTypes.VISA,
  },
];

const currencyColors = {
  USD: '#16A34A',
  UZS: '#2563EB',
};

export const currencyTagUi = (currencySymb: 'UZS' | 'USD', fontSizes = '12px') => (
  <p
    style={{
      fontSize: fontSizes,
      padding: '0 6px',
      lineHeight: '16px',
      fontWeight: 'bold',
      display: 'inline',
      color: currencyColors[currencySymb],
    }}
  >
    {currencySymb}
  </p>
);
