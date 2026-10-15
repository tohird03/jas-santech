import React, { useState } from 'react';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { ISingleProductStory } from '@/api/product/types';
import { incomeProductsStore, ordersStore, returnedOrdersStore } from '@/stores/products';

type Props = {
  client: ISingleProductStory;
  type: 'selling' | 'arrival' | 'returning';
};

export const ProductStoryClientName = ({
  client,
  type,
}: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'selling') {
      ordersStore.setOrderId(client?.selling?.id);
      ordersStore.setIsOpenAddEditNewOrderModal(true);
    }

    if (type === 'arrival') {
      incomeProductsStore.setIncomeOrderId(client?.arrival?.id);
      incomeProductsStore.setIsOpenAddEditIncomeProductsModal(true);
    }

    if (type === 'returning') {
      returnedOrdersStore.setReturnedOrderId(client?.returning?.id);
      returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(true);
    }
  };

  const fullname =
    type === 'selling'
      ? client?.selling?.client?.fullname
      : type === 'arrival'
        ? client?.arrival?.supplier?.fullname
        : client?.returning?.client?.fullname;

  return (
    <div
      onClick={handleClick}
      style={{
        color: '#17a2b8',
        cursor: 'pointer',
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        {client?.type === type ? fullname : null}
      </p>
    </div>
  );
};
