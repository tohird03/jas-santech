import { IOrder } from '@/api/order/types';
import { ordersStore } from '@/stores/products';
import { Tag } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

type Props = {
  order: IOrder | null;
};

export const PaymentStatus = observer(({ order }: Props) => {

  const handleOpenPaymentModal = () => {
    if (order?.id) {
      ordersStore.setOrderPayment({
        payment: order?.payment,
        client: order?.client,
        orderId: order?.id,
      });
      ordersStore.setIsOpenPaymentModal(true);
      ordersStore.setOrder(order);
    }
  };

  return (
    <Tag
      color={order?.payment ? '#2A93D5' : '#145388'}
      onClick={handleOpenPaymentModal}
      style={{cursor: 'pointer'}}
    >
      {order?.payment ? 'To\'lovni ko\'rish' : 'To\'lovni tasdiqlash'}
    </Tag>
  );
});
