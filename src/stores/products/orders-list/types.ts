import {IClientsInfo} from '@/api/clients';
import {IAddEditPaymentParams} from '@/api/payment/types';

export interface IOrderPayment {
  client?: IClientsInfo;
  orderId: string;
  payment: IAddEditPaymentParams | undefined;
}
