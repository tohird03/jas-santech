import {ReactNode} from 'react';

export interface IMenuItems {
  children?: IMenuItems[] | [];
  icon: ReactNode;
  key: string;
  label: string;
  parent?: IMenuItems['key'];
}

export enum PaymentTypes {
  CASH = 'cash',
  UZCARD = 'uzcard',
  HUMO = 'humo',
  TRANSFER = 'transfer',
  CLICK = 'click',
  PAYME = 'payme',
  VISA = 'visa',
  UZUM = 'uzum',
  OTHER = 'other',
}

