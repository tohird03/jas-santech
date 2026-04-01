export interface IResponse<TBody, TTotalCalc = any> {
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    data: TBody;
    calc?: TTotalCalc;
  };
}

export interface IOneElement {
  id: string;
  name: string;
}

export interface ISuccessResponse {
  success: boolean;
}

export interface IPagination {
  pageNumber?: number;
  pageSize?: number;
  description?: string;
}

export type TStage = {
  apiUrl: string;
  cdnHost?: string;
};

export interface IPayment extends IPaymentType {
  id: string,
  createdAt: string;
  updatedAt: string;
  totalPay: number,
}

export interface IPaymentType {
  card: number,
  cash: number,
  transfer: number,
  other: number,
  description: string,
}
