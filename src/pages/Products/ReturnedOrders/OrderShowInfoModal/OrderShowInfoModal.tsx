import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {Button, Modal, notification, Table} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {returnedOrdersStore} from '@/stores/products';
import {returnedOrdersColumns, returnedOrdersInfoProductsColumns} from '../constants';

export const ReturnedOrderShowInfoModal = observer(() => {
  const handleModalClose = () => {
    returnedOrdersStore.setSingleReturnedOrder(null);
    returnedOrdersStore.setIsOpenShowEditModal(false);
  };

  useEffect(() => {
    if (!returnedOrdersStore?.singleReturnedOrder) {
      notification.error({
        message: 'Bu sotuv topilmadi!',
        placement: 'topRight',
      });
      handleModalClose();
    }
  }, [returnedOrdersStore?.singleReturnedOrder]);

  return (
    <Modal
      open={returnedOrdersStore.isOpenShowProductModal}
      title={'Sotuv'}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      style={{top: 0, padding: 0}}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <Button onClick={handleModalClose}>
          Yopish
        </Button>
      }
    >
      <DataTable
        columns={returnedOrdersColumns}
        data={[returnedOrdersStore?.singleReturnedOrder]}
        pagination={false}
      />
      <Table
        columns={returnedOrdersInfoProductsColumns}
        dataSource={returnedOrdersStore?.singleReturnedOrder?.products || []}
        pagination={false}
      />
    </Modal>
  );
});
