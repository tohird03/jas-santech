import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Table, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {warehouseStore} from '@/stores/products';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import {clientsColumns} from './constants';
import styles from './warehouse.scss';

const cn = classNames.bind(styles);

export const Warehouse = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {data: warehousesData, isLoading: loading} = useQuery({
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
    <main className="warehouse-page">
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

      {isMobile ? (
        <DataTable
          className="warehouse-cards"
          isMobile
          columns={clientsColumns}
          data={warehousesData?.data?.data || []}
          loading={loading}
        />
      ) : (
        <Table
          columns={clientsColumns}
          dataSource={warehousesData?.data?.data || []}
          loading={loading}
        />
      )}

      {warehouseStore.isOpenAddEditCurrency && <AddEditModal />}
    </main>
  );
});
