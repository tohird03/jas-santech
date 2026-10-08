export interface IReminderClient {
  id: string;
  fullname: string;
  phone: string | null;
}

export interface IReminder {
  id: string;
  clientId: string;
  client: IReminderClient;
  startDate: string;
  description: string;
  lastSentOn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IReminderList {
  data: IReminder[];
  totalCount: number;
  pageSize: number;
  pagesCount: number;
}

export interface IReminderResult<T> {
  data: T;
  warning?: {
    is: boolean;
    messages: string[];
  };
}

export interface IReminderQuery {
  pageNumber: number;
  pageSize: number;
  clientId?: string;
}

export interface IReminderForm {
  clientId: string;
  startDate: string;
  description: string;
}
