import { IIncomeOrder } from '@/api/income-products/types';
import { IOrder } from '@/api/order/types';
import { incomeProductsStore, ordersStore } from '@/stores/products';
import { Tag } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

type Props = {
  incomeOrder: IIncomeOrder | null;
};

export const PaymentStatus = observer(({ incomeOrder }: Props) => {

  const handleOpenPaymentModal = () => {
    if (incomeOrder?.id) {
      incomeProductsStore.setIncomeOrderPayment({
        payment: incomeOrder?.payment,
        supplier: incomeOrder?.supplier,
        orderId: incomeOrder?.id,
      });
      incomeProductsStore.setIsOpenIncomePaymentModal(true);
      incomeProductsStore.setIncomeOrder(incomeOrder);
    }
  };

  return (
    <Tag
      color={incomeOrder?.payment ? '#2A93D5' : '#145388'}
      onClick={handleOpenPaymentModal}
      style={{cursor: 'pointer'}}
    >
      {incomeOrder?.payment ? 'To\'lovni ko\'rish' : 'To\'lovni tasdiqlash'}
    </Tag>
  );
});
