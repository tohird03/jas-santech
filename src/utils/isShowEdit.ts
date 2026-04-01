import { IOrderStatus } from '@/api/order/types';

export const isShowEdit = (status: IOrderStatus, createdAt: string, isClosedDay: boolean, role?: string): boolean => {
  if (!status || !createdAt) return false;
  if (isClosedDay) return false;

  const today = new Date().toISOString().split('T')[0];
  const orderDate = createdAt.split('T')[0]?.split(' ')[0];

  const isToday = today === orderDate;

  return isToday || status === IOrderStatus.NOTACCEPTED;
};

export const isShowEditPayments = (createdAt: string, isClosedDay: boolean, role?: string): boolean => {
  if (!createdAt) return false;
  if (isClosedDay) return false;

  const today = new Date().toISOString().split('T')[0];
  const orderDate = createdAt.split('T')[0]?.split(' ')[0];

  const isToday = today === orderDate;

  return isToday;
};
