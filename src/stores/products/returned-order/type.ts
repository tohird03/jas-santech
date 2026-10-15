import { IClientsInfo } from "@/api/clients";
import { IReturnedOrderPaymentParams } from "@/api/returned-order/types";

export interface ISingleReturnedOrderPayment {
  client?: IClientsInfo;
  orderId: string;
  payment: IReturnedOrderPaymentParams | undefined;
}
