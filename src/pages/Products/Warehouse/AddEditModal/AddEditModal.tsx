import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { addNotification } from '@/utils';
import { warehouseStore } from '@/stores/products';
import { warehouseApi } from '@/api/warehouse';
import { IAddEditWarehouse } from '@/api/warehouse/types';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addWarehouse} =
  useMutation({
    mutationKey: ['addWarehouse'],
    mutationFn: (params: IAddEditWarehouse) => warehouseApi.addWarehouse(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getWarehouses']});
      addNotification('Sklad muvaffaqiyatli qo\'shildi');

      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const { mutate: updateWarehouse } =
    useMutation({
      mutationKey: ['updateWarehouse'],
      mutationFn: (params: IAddEditWarehouse) => warehouseApi.updateWarehouse(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getWarehouses'] });
        addNotification('Sklad muvaffaqiyatli tahrirlandi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddEditWarehouse) => {
    setLoading(true);

    if (warehouseStore?.singleWarehouse) {
      updateWarehouse({
        ...values,
        id: warehouseStore?.singleWarehouse?.id!,
      });

      return;
    }
    addWarehouse(values);
  };

  const handleModalClose = () => {
    warehouseStore.setSingleWarehouse(null);
    warehouseStore.setIsOpenAddEditWarehouseModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (warehouseStore.singleWarehouse) {
      form.setFieldsValue({
        name: warehouseStore.singleWarehouse?.name,
      });
    }
  }, [warehouseStore.singleWarehouse]);

  return (
    <Modal
      open={warehouseStore.isOpenAddEditCurrency}
      title={warehouseStore.singleWarehouse ? 'Skladni beruvchini tahrirlash' : 'Skladni beruvchini qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={warehouseStore.singleWarehouse ? 'Skladni beruvchini tahrirlash' : 'Skladni beruvchini qo\'shish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Sklad"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
});
