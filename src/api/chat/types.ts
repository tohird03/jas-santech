export type ChatDirection = 'in' | 'out' | 'system';
export type ChatKind = 'text' | 'document' | 'photo';

export interface IChatStaff {
  id: string;
  fullname: string;
}

export interface IChatMessage {
  id: string;
  clientId: string;
  direction: ChatDirection;
  kind: ChatKind;
  text: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileUrl: string | null;
  telegramMessageId: number | null;
  staffId: string | null;
  staff: IChatStaff | null;
  sellingId: string | null;
  createdAt: string;
}

export interface IChatInboxMessage {
  text: string | null;
  kind: ChatKind;
  fileName: string | null;
  direction: ChatDirection;
  createdAt: string;
}

export interface IChatInboxItem {
  id: string;
  fullname: string;
  phone: string;
  telegram: {isActive: boolean} | null;
  incomingCount: number;
  lastMessage: IChatInboxMessage;
}

export interface IChatList {
  data: IChatMessage[];
  totalCount: number;
  pageSize: number;
  pagesCount: number;
}

export interface IApiResult<T> {
  data: T;
  warning?: {
    is: boolean;
    messages: string[];
  };
}
