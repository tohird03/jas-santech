import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal } from 'antd';
import { addNotification } from '@/utils';
import { productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { productsApi } from '@/api/product/product';
import { IAddEditProduct } from '@/api/product/types';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { mutate: addNewProduct } =
    useMutation({
      mutationKey: ['addNewProduct'],
      mutationFn: (params: IAddEditProduct) => productsApi.addNewProduct(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const { mutate: updateProduct } =
    useMutation({
      mutationKey: ['updateProduct'],
      mutationFn: (params: IAddEditProduct) => productsApi.updateProduct(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddEditProduct) => {
    setLoading(true);

    if (productsListStore?.singleProduct) {
      updateProduct({
        ...values,
        id: productsListStore?.singleProduct?.id!,
      });

      return;
    }
    addNewProduct(values);
  };

  const handleModalClose = () => {
    productsListStore.setSingleProduct(null);
    productsListStore.setIsOpenAddEditProductModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (productsListStore.singleProduct) {
      form.setFieldsValue({
        ...productsListStore.singleProduct,
      });
    }
  }, [productsListStore.singleProduct]);

  return (
    <Modal
      open={productsListStore.isOpenAddEditProductModal}
      title={productsListStore.singleProduct ? 'Mahsulotni tahrirlash' : 'Mahsulotni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={productsListStore.singleProduct ? 'Mahsulotni tahrirlash' : 'Mahsulotni qo\'shish'}
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
          label="Mahsulot nomi"
          rules={[{ required: true }]}
          name="name"
        >
          <Input placeholder="Mahsulot nomi" />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Qoldiq mahsulot"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Ogohlantiruvchi qoldiq"
          name="minAmount"
        >
          <InputNumber
            placeholder="Ushbu sondan kam qolgan mahsulot haqida sizni ogohlantiramiz!"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Sotish narxi"
          rules={[{ required: true }]}
          name="price"
        >
          <InputNumber
            placeholder="Sotish narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Sotib olingan narxi"
          rules={[{ required: true }]}
          name="cost"
        >
          <InputNumber
            placeholder="Sotib olingan narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
