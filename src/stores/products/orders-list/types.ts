import { IClientsInfo } from "@/api/clients";
import { IPayment } from "@/api/types";

export interface IOrderPayment {
  client?: IClientsInfo;
  orderId: string;
  payment: IPayment | undefined;
}
