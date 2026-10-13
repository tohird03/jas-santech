import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Button, Modal, notification, Table} from 'antd';
import classNames from 'classnames';
import {ordersApi} from '@/api/order';
import {DataTable} from '@/components/Datatable/datatable';
import {ordersStore} from '@/stores/products';
import {DeletedOrderProduct} from '../AddEditModal/DeletedOrderProducts';
import {ordersInfoColumns, ordersInfoPaymentColumns, ordersInfoProductsColumns} from '../constants';
import styles from '../orders.scss';

const cn = classNames.bind(styles);

export const OrderShowInfoModal = observer(() => {
  const singleOrderId = ordersStore.singleOrder?.id;

  const {
    data: singleOrderData,
    isError,
  } = useQuery({
    queryKey: ['getSingleOrder', singleOrderId],

    queryFn: () => ordersApi.getSingleOrder(singleOrderId!),
  });

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setIsOpenShowOrderModal(false);
  };

  useEffect(() => {
    if (isError) {
      notification.error({
        message: 'Bu sotuv topilmadi!',
        placement: 'topRight',
      });

      handleModalClose();
    }
  }, [isError]);

  return (
    <Modal
      open={ordersStore.isOpenShowOrderModal}
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
      <div className={cn('order__show-header')}>
        <DataTable
          columns={ordersInfoColumns}
          data={singleOrderData?.data ? [singleOrderData.data] : []}
          isMobile
          pagination={false}
        />
        <DataTable
          columns={ordersInfoPaymentColumns}
          data={singleOrderData?.data ? [singleOrderData.data] : []}
          isMobile
          pagination={false}
        />
      </div>
      <p>{singleOrderData?.data?.description}</p>
      <div>
        <Table
          columns={ordersInfoProductsColumns}
          dataSource={singleOrderData?.data?.products || []}
          pagination={false}
        />
      </div>

      <DeletedOrderProduct />
    </Modal>
  );
});
