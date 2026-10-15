import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Table, Typography } from 'antd';
import classNames from 'classnames';
import { AddEditModal } from './AddEditModal';
import styles from './warehouse.scss';
import { clientsColumns } from './constants';
import { warehouseStore } from '@/stores/products';
import { PlusCircleOutlined } from '@ant-design/icons';

const cn = classNames.bind(styles);

export const Warehouse = observer(() => {
  const { data: warehousesData, isLoading: loading } = useQuery({
    queryKey: ['getWarehouses'],
    queryFn: () =>
      warehouseStore.getWarehouses(),
  });

  const handleAddNewWarehouse = () => {
    warehouseStore.setIsOpenAddEditWarehouseModal(true);
  };

  useEffect(() => () => {
    warehouseStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('currency__head')}>
        <Typography.Title level={3}>Skladlar</Typography.Title>
        <div className={cn('supplier-info__filter')}>
          <Button
            onClick={handleAddNewWarehouse}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Sklad qo&lsquo;shish
          </Button>
        </div>
      </div>

      <Table
        columns={clientsColumns}
        dataSource={warehousesData?.data?.data || []}
        loading={loading}
      />

      {warehouseStore.isOpenAddEditCurrency && <AddEditModal />}
    </main>
  );
});
