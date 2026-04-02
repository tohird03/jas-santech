import { priceFormat } from '@/utils/priceFormat';

export {ROUTES} from './routes';
export type {IMenuItems} from './types';

export const PRICEUSDVALUE = 12200;

export const OPTIONVALUTE = [
  {
    value: 'USD',
    label: `USD | ${priceFormat(PRICEUSDVALUE)}`,
  },
  {
    value: 'UZS',
    label: 'UZS | 1',
  },
];

export const DEFAULTVALUTE = 'USD';
