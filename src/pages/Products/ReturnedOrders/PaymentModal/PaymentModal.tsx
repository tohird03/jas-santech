import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, Modal } from 'antd';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { IIncomeAddEditPaymentParams } from '@/api/payment-income/types';
import { returnedOrdersStore } from '@/stores/products';
import { returnedOrderApi } from '@/api/returned-order/returned-order';
import { IReturnedOrderPayments } from '@/api/returned-order/types';
import { authStore } from '@/stores/auth';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { isCloseDay } = authStore;

  const today = new Date().toISOString().split('T')[0];
  const checkDate = returnedOrdersStore.singleReturnedOrder?.date?.split('T')[0]?.split(' ')[0];
  const isToday = checkDate === today && !isCloseDay;

  const handleSubmit = (values: IReturnedOrderPayments) => {
    setLoading(true);

    returnedOrderApi.updateReturnedOrder({
      payment: {
        cash: values?.cash || 0,
        fromBalance: values?.fromBalance || 0,
      },
      id: returnedOrdersStore?.singleReturnedOrder?.id!,
    })
      .then(() => {
        addNotification('Qaytuv tasdiqlandi');
        queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    returnedOrdersStore.setSinglePayment(null);
    returnedOrdersStore.setSingleReturnedOrder(null);
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(false);
    returnedOrdersStore.setIsOpenPaymentModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleClickClientDebt = () => {
    form.setFieldValue('cash', 0);
    form.setFieldValue('fromBalance', totalPrice);
  };

  const handleClickCashDebt = () => {
    form.setFieldValue('cash', totalPrice);
    form.setFieldValue('fromBalance', 0);
  };

  useEffect(() => {
    if (returnedOrdersStore.singlePayment) {
      form.setFieldsValue(returnedOrdersStore.singlePayment);
    }
  }, [returnedOrdersStore.singlePayment]);

  useEffect(() => {
    if (returnedOrdersStore?.singleReturnedOrder) {
      const totalPriceCalc = returnedOrdersStore.singleReturnedOrder?.products?.reduce((prev, curr) => prev + (curr?.price * curr?.count), 0);

      setTotalPrice(totalPriceCalc);
      if (!returnedOrdersStore.singlePayment?.cash && !returnedOrdersStore.singlePayment?.fromBalance) {
        form.setFieldValue('cash', totalPriceCalc);
      }
    }
  }, [returnedOrdersStore?.singleReturnedOrder]);

  return (
    <Modal
      open={returnedOrdersStore.isOpenPaymentModal}
      title="Qaytuvni tasdiqlash"
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Maqullash"
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
      footer={
        <Button
          onClick={handleModalOk}
          type="primary"
          disabled={!isToday}
          loading={loading}
        >
          Maqullash
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Mijozning hisobidan ayirish"
          name="fromBalance"
          initialValue={0}
        >
          <InputNumber
            placeholder="Mijozning hisobidan ayirish"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                type="primary"
                onClick={handleClickClientDebt}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          name="cash"
          initialValue={0}
        >
          <InputNumber
            placeholder="Naqd to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                type="primary"
                onClick={handleClickCashDebt}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
      </Form>
      <div>
        <p style={{ textAlign: 'end', fontSize: '16px', fontWeight: 'bold' }}>
          Umumiy qiymati: {priceFormat(totalPrice)}
        </p>
      </div>
    </Modal>
  );
});
