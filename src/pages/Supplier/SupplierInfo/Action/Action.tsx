import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {addNotification} from '@/utils';
import { supplierInfoStore } from '@/stores/supplier';
import { ISupplierInfo } from '@/api/supplier/types';
import { supplierInfoApi } from '@/api/supplier/supplier';

type Props = {
  supplier: ISupplierInfo;
};

export const Action: FC<Props> = observer(({supplier}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteSupplier} =
  useMutation({
    mutationKey: ['deleteSupplier'],
    mutationFn: (id: string) => supplierInfoApi.deleteSupplier(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getSuppliers']});
    },
    onError: addNotification,
  });

  const handleEditProcess = () => {
    supplierInfoStore.setSingleSupplierInfo(supplier);
    supplierInfoStore.setIsOpenAddEditSupplierModal(true);
  };

  const handleDelete = () => {
    deleteSupplier(supplier?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Yetkazib beruvchini o'chirish"
        description="Rostdan ham bu yetkazib beruvchini o'chirishni xohlaysizmi?"
        onConfirm={handleDelete}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
