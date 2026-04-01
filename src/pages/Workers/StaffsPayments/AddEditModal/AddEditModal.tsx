import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {addNotification} from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { staffsApi } from '@/api/staffs';
import { staffsPaymentStore } from '@/stores/workers/staffs-payments';
import { IAddEditStaffsPayment } from '@/api/staffs-payments/types';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: sellerData, isLoading: loadingSeller } = useQuery({
    queryKey: ['getSellers'],
    queryFn: () =>
      staffsApi.getStaffs({
        pageNumber: 1,
        pageSize: 100,
      }),
  });

  const {mutate: addNewStaffPayment} =
    useMutation({
      mutationKey: ['addNewStaffPayment'],
      mutationFn: (params: IAddEditStaffsPayment) => staffsPaymentsApi.addStaffsPayment(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getStaffsPayments']});
        addNotification('To\'lov muvaffaqiyatli qo\'shildi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateClient} =
    useMutation({
      mutationKey: ['updateClient'],
      mutationFn: (params: IAddEditStaffsPayment) => staffsPaymentsApi.updateStaffsPayment(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getStaffsPayments']});
        addNotification('To\'lov muvaffaqiyatli tahrirlandi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddEditStaffsPayment) => {
    setLoading(true);

    if (staffsPaymentStore?.singleStaffPayments) {
      updateClient({
        ...values,
        id: staffsPaymentStore?.singleStaffPayments?.id!,
      });

      return;
    }
    addNewStaffPayment(values);
  };

  const handleModalClose = () => {
    staffsPaymentStore.setSingleStaffPayments(null);
    staffsPaymentStore.setIsOpenAddEditStaffPaymentsModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const sellerOptions = useMemo(() => (
    sellerData?.data?.data.map((sellerData) => ({
      value: sellerData?.id,
      label: `${sellerData?.fullname}`,
    }))
  ), [sellerData]);

  useEffect(() => {
    if (staffsPaymentStore.singleStaffPayments) {
      form.setFieldsValue({
        ...staffsPaymentStore.singleStaffPayments,
        userId: staffsPaymentStore.singleStaffPayments?.user?.id,
      });
    }
  }, [staffsPaymentStore.singleStaffPayments]);

  return (
    <Modal
      open={staffsPaymentStore.isOpenAddEditStaffPaymentsModal}
      title={staffsPaymentStore.singleStaffPayments ? 'Xodim hisobotini tahrirlash' : 'Xodim hisobotini qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={staffsPaymentStore.singleStaffPayments ? 'Xodim hisobotini tahrirlash' : 'Xodim hisobotini qo\'shish'}
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
          name="userId"
          label="Xodim"
          rules={[{required: true}]}
        >
          <Select
            options={sellerOptions}
            style={{ width: '100%' }}
            placeholder="Xodim"
            loading={loadingSeller}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="To'lov qiymati"
          name="sum"
          initialValue={0}
        >
          <InputNumber
            placeholder="To'lov qiymati"
            defaultValue={0}
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
