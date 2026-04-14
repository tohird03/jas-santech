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
    label: 'Naqd',
  },
  {
    value: PaymentTypes.CLICK,
    label: 'Click',
  },
  {
    value: PaymentTypes.HUMO,
    label: 'Humo',
  },
  {
    value: PaymentTypes.PAYME,
    label: 'Payme',
  },
  {
    value: PaymentTypes.TRANSFER,
    label: 'O\'tkazma',
  },
  {
    value: PaymentTypes.UZCARD,
    label: 'Uzcard',
  },
  {
    value: PaymentTypes.UZUM,
    label: 'Uzum',
  },
  {
    value: PaymentTypes.VISA,
    label: 'Visa',
  },
  {
    value: PaymentTypes.OTHER,
    label: 'Boshqa usullar',
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
