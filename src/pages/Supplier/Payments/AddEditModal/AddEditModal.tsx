import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select, Spin } from 'antd';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { supplierInfoStore, supplierPaymentsStore } from '@/stores/supplier';
import { incomePaymentApi } from '@/api/payment-income';
import { IIncomeAddEditPaymentParams } from '@/api/payment-income/types';
import { useParams } from 'react-router-dom';

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const {supplierId} = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchSupplier, setSearchSupplier] = useState<string | null>(null);

  // GET DATAS
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchSupplier],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: 1,
        pageSize: 15,
        search: searchSupplier!,
      }),
  });

  const handleSubmit = (values: IIncomeAddEditPaymentParams) => {
    setLoading(true);

    if (supplierPaymentsStore?.singlePayment) {
      incomePaymentApi.updateIncomePayment({
        ...values,
        id: supplierPaymentsStore?.singlePayment?.id,
      })
        .then(() => {
          addNotification('To\'lov muvaffaqiyatli tahrirlandi!');
          queryClient.invalidateQueries({ queryKey: ['getPayments'] });
          handleModalClose();
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    incomePaymentApi.addIncomePayment(values)
      .then(() => {
        addNotification('To\'lov muvaffaqiyatli qo\'shildi!');
        queryClient.invalidateQueries({ queryKey: ['getPayments'] });
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    supplierPaymentsStore.setSinglePayment(null);
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handlesearchSupplier = (value: string) => {
    setSearchSupplier(value);
  };

  const handleClearClient = () => {
    setSearchSupplier(null);
  };

  const clientsOptions = useMemo(() => (
    clientsData?.data?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.fullname}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (supplierPaymentsStore.singlePayment) {
      setSearchSupplier(supplierPaymentsStore?.singlePayment?.user?.phone);

      form.setFieldsValue({
        ...supplierPaymentsStore.singlePayment,
        userId: supplierPaymentsStore?.singlePayment?.user?.id,
      });
    } else if (supplierId) {
      form.setFieldValue('userId', supplierId);
    }
  }, [supplierPaymentsStore.singlePayment, supplierId]);

  return (
    <Modal
      open={supplierPaymentsStore.isOpenAddEditPaymentModal}
      title={supplierPaymentsStore.singlePayment ? 'To\'lovni tahrirlash' : 'To\'lov qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={supplierPaymentsStore.singlePayment ? 'To\'lovni tahrirlash' : 'To\'lov qo\'shish'}
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
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="userId"
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            loading={loadingClients}
            optionFilterProp="children"
            notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handlesearchSupplier}
            onClear={handleClearClient}
            options={clientsOptions}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          name="cash"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Bank kartasi orqali to'lov"
          name="card"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Bank o'tkazmasi orqali to'lov"
          name="transfer"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank o'tkazmasi orqali to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Boshqa usullar bilan to'lov"
          name="other"
          initialValue={0}
        >
          <InputNumber
            placeholder="Boshqa usullar bilan to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="To'lov haqida ma'lumot"
          name="description"
        >
          <Input.TextArea
            placeholder="To'lov haqida ma'lumot"
            style={{ width: '100%' }}
            rows={4}
            maxLength={100}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
