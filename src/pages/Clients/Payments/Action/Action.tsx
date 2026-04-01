import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import { addNotification } from '@/utils';
import { IClientsPayments } from '@/api/payment/types';
import { paymentsStore } from '@/stores/clients';
import { clientsPaymentApi } from '@/api/payment';
import { authStore } from '@/stores/auth';
import { isShowEditPayments } from '@/utils/isShowEdit';

type Props = {
  clientPayment: IClientsPayments;
};

export const Action: FC<Props> = observer(({ clientPayment }) => {
  const queryClient = useQueryClient();

  const { mutate: deletePayment } =
    useMutation({
      mutationKey: ['deletePayment'],
      mutationFn: (id: string) => clientsPaymentApi.deletePayment(id!),
      onSuccess: () => {
        addNotification('To\'lov o\'chirildi');
        queryClient.invalidateQueries({ queryKey: ['getPayments'] });
      },
      onError: addNotification,
    });

  const handleEditPayment = () => {
    paymentsStore.setSinglePayment(clientPayment);
    paymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleDeletePayment = () => {
    deletePayment(clientPayment?.id);
  };

  const isShowEdit = isShowEditPayments(clientPayment?.createdAt, authStore.isCloseDay);

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      {isShowEdit && (
        <>
          <Button onClick={handleEditPayment} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="To'lovni o'chirish"
            description="Rostdan ham bu to'lovni o'chirishni xohlaysizmi?"
            onConfirm={handleDeletePayment}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )}
    </div>
  );
});
