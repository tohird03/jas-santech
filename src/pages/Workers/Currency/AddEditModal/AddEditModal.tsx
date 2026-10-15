import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { IEditCurrency } from '@/api/auth/types';
import { currencyStore } from '@/stores/workers';
import { authApi } from '@/api';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { mutate: updateCurrency } =
    useMutation({
      mutationKey: ['updateCurrency'],
      mutationFn: (params: IEditCurrency) => authApi.currencyEdit(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getCurrency'] });
        addNotification('Valyuta muvaffaqiyatli tahrirlandi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IEditCurrency) => {
    setLoading(true);

    const currencyOptions: IEditCurrency = {
      id: currencyStore?.singleCurrency?.id!,
      exchangeRate: values?.exchangeRate,
    };

    updateCurrency(currencyOptions);
  };

  const handleModalClose = () => {
    currencyStore.setSingleCurrency(null);
    currencyStore.setIsOpenEditCurrencyModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (currencyStore.singleCurrency) {
      form.setFieldsValue({
        name: currencyStore.singleCurrency?.symbol,
        exchangeRate: currencyStore?.singleCurrency?.exchangeRate,
      });
    }
  }, [currencyStore.singleCurrency]);

  return (
    <Modal
      open={currencyStore.isOpenEditCurrency}
      title={'Valyutani tahrirlash'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={'Valyutani tahrirlash'}
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
          label="Valyuta"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="exchangeRate"
          label="Qiymat"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value)}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
});
