import React from 'react';
import {Tooltip} from 'antd';
import {ISingleProductStory} from '@/api/product/types';
import {incomeProductsStore, ordersStore, returnedOrdersStore} from '@/stores/products';

type Props = {
  client: ISingleProductStory;
  type: 'selling' | 'arrival' | 'returning';
};

export const ProductStoryClientName = ({
  client,
  type,
}: Props) => {
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
      className="clip-box"
      onClick={handleClick}
      style={{
        color: '#17a2b8',
        cursor: 'pointer',
      }}
    >
      {client?.type === type && fullname ? (
        <Tooltip
          title={fullname}
          placement="topLeft"
          mouseEnterDelay={0}
          zIndex={3000}
          getPopupContainer={() => document.body}
        >
          <p className="cell-ellipsis" style={{margin: 0, fontWeight: 'bold', fontSize: '14px'}}>
            {fullname}
          </p>
        </Tooltip>
      ) : null}
    </div>
  );
};
