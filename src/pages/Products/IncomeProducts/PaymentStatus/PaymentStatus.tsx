import React from 'react';
import {observer} from 'mobx-react';
import {Tag} from 'antd';
import {IIncomeOrder} from '@/api/income-products/types';
import {incomeProductsStore} from '@/stores/products';

type Props = {
  incomeOrder: IIncomeOrder | null;
};

export const PaymentStatus = observer(({incomeOrder}: Props) => {

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
