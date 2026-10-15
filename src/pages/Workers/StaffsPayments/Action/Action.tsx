import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import { addNotification } from '@/utils';
import { IStaffsPayments } from '@/api/staffs-payments/types';
import { staffsPaymentStore } from '@/stores/workers/staffs-payments';
import { authStore } from '@/stores/auth';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';

type Props = {
  staffsPayment: IStaffsPayments;
};

export const Action: FC<Props> = observer(({ staffsPayment }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteStaffsPayment } =
    useMutation({
      mutationKey: ['deleteStaffsPayment'],
      mutationFn: (id: string) => staffsPaymentsApi.deleteStaffPayment(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getStaffsPayments'] });
      },
      onError: addNotification,
    });

  const handleEditStaffsPayments = () => {
    staffsPaymentStore.setSingleStaffPayments(staffsPayment);
    staffsPaymentStore.setIsOpenAddEditStaffPaymentsModal(true);
  };

  const handleDelete = () => {
    deleteStaffsPayment(staffsPayment?.id);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      {/* {authStore?.staffInfo?.role === 'super_admin' && ( */}
      <>
        <Button onClick={handleEditStaffsPayments} type="primary" icon={<EditOutlined />} />
        <Popconfirm
          title="Xodim hisobotini o'chirish"
          description="Rostdan ham xodimni bu hisobotini o'chirishni xohlaysizmi?"
          onConfirm={handleDelete}
          okText="Ha"
          okButtonProps={{ style: { background: 'red' } }}
          cancelText="Yo'q"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </>
    </div>
  );
});
