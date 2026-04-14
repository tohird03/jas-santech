import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {addNotification} from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { staffsApi } from '@/api/staffs';
import { staffsPaymentStore } from '@/stores/workers/staffs-payments';
import { IAddEditStafPaymentForm, IAddEditStaffsPayment } from '@/api/staffs-payments/types';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';
import { authStore } from '@/stores/auth';
import { PriceWithCurrency } from '@/utils/hooks/valuteConversition';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { data: currencyMany, isLoading: loadingClients } = useQuery({
    queryKey: ['getCurrencyMany'],
    queryFn: () =>
      authStore.getCurrencyMany(),
  });

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

  const handleSubmit = (values: IAddEditStafPaymentForm) => {
    setLoading(true);

    const staffPay: IAddEditStaffsPayment = {
      method: {
        currencyId: values?.currencyId!,
        amount: values?.amount!,
      },
      description: values?.description,
      employeeId: values?.employeeId,
    };

    if (staffsPaymentStore?.singleStaffPayments) {
      updateClient({
        ...staffPay,
        id: staffsPaymentStore?.singleStaffPayments?.id!,
      });

      return;
    }
    addNewStaffPayment(staffPay);
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

  const currencyManyData = useMemo(() => (
    currencyMany?.data.map((currency) => ({
      value: currency?.id,
      label: `${currency?.symbol} | ${priceFormat(currency?.exchangeRate)}`,
      code: currency?.symbol,
      rate: currency?.exchangeRate,
    })) || []
  ), [currencyMany]);

  useEffect(() => {
    if (staffsPaymentStore.singleStaffPayments) {
      form.setFieldsValue({
        ...staffsPaymentStore.singleStaffPayments,
        employeeId: staffsPaymentStore.singleStaffPayments?.employee?.id,
        currencyId: staffsPaymentStore?.singleStaffPayments?.methods[0]?.currency?.id,
        amount: staffsPaymentStore?.singleStaffPayments?.methods[0]?.amount,
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
          name="employeeId"
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

        <PriceWithCurrency
          form={form}
          valueName="amount"
          currencyName="currencyId"
          label="To'lov qiymati"
          required
          currencyOptions={currencyManyData}
        />

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
