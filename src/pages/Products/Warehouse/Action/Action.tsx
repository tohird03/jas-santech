import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ICurrency } from '@/api/auth/types';
import { currencyStore } from '@/stores/workers';
import { IProductWarehouse } from '@/api/warehouse/types';
import { warehouseStore } from '@/stores/products';

type Props = {
  warehouse: IProductWarehouse;
};

export const Action: FC<Props> = observer(({ warehouse }) => {
  const handleEditWarehouse = () => {
    warehouseStore.setSingleWarehouse(warehouse);
    warehouseStore.setIsOpenAddEditWarehouseModal(true);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Button onClick={handleEditWarehouse} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
