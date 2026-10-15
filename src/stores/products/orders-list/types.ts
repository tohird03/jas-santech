import { IClientsInfo } from "@/api/clients";
import { IAddEditPaymentParams } from "@/api/payment/types";
import { IPayment } from "@/api/types";

export interface IOrderPayment {
  client?: IClientsInfo;
  orderId: string;
  payment: IAddEditPaymentParams | undefined;
}
