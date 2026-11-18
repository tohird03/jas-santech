import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';

import { ordersStore } from '@/stores/products';
import { ordersInfoProductsColumns } from '../constants';

export const DeletedOrderProduct = observer(() => {
  const deletedProducts =
    ordersStore?.order?.deletedProducts || [];

  return (
    <Table
      rowKey="id"
      columns={ordersInfoProductsColumns}
      dataSource={deletedProducts}
      pagination={false}
      scroll={{ x: 500 }}
      rowClassName="error__row"
    />
  );
});
