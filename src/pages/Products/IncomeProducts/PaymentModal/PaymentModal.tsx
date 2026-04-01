import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { observer } from 'mobx-react';
import { priceFormat } from '@/utils/priceFormat';
import { IPaymentType } from '@/api/types';
import { addNotification } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { incomeProductsStore } from '@/stores/products';
import { incomeProductsApi } from '@/api/income-products';
import { singleSupplierStore } from '@/stores/supplier';
import { useParams } from 'react-router-dom';
import { authStore } from '@/stores/auth';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { supplierId } = useParams();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const {isCloseDay} = authStore;

  const today = new Date().toISOString().split('T')[0];
  const checkDate = incomeProductsStore.incomeOrder?.date?.split('T')[0]?.split(' ')[0];
  const isToday = checkDate === today && !isCloseDay;

  const handleModalClose = () => {
    incomeProductsStore.setIncomeOrderPayment(null);
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
    incomeProductsStore.setIsOpenIncomePaymentModal(false);
  };

  const handleSavePayment = () => {
    form.submit();
  };

  const handleSubmitPayment = (values: IPaymentType) => {
    if (!isToday) {
      message.info('Oldingi to\'lovni o\'zgartirolmaysiz!');

      return;
    }

    setLoadingPayment(true);

    incomeProductsApi.updateIncomeOrder({
      id: incomeProductsStore?.incomeOrder?.id!,
      supplierId: form.getFieldValue('supplierId'),
      payment: values,
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        if (supplierId) {
          singleSupplierStore.getSingleSupplier({
            id: supplierId,
          });
        }
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setLoadingPayment(false);
      });
  };

  const handleValuesChange = (_: any, allValues: any) => {
    const { cash = 0, card = 0, transfer = 0, other = 0 } = allValues;
    const total = [cash, card, transfer, other].reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );

    setTotalPayment(total);
  };

  const handleAddonClick = (fieldName: string) => {
    const allValues = form.getFieldsValue();
    const { cash = 0, card = 0, transfer = 0, other = 0 } = allValues;

    const totalEntered = cash + card + transfer + other;

    console.log(totalEntered);

    const remainingAmount = totalPrice - totalEntered;

    if (remainingAmount > 0) {
      form.setFieldsValue({
        [fieldName]: (allValues[fieldName] || 0) + remainingAmount,
      });
    }

    setTotalPayment(totalPrice);
  };

  useEffect(() => {
    if (incomeProductsStore.incomeOrderPayment?.payment) {
      const payment = incomeProductsStore?.incomeOrderPayment?.payment;

      if (payment) {
        const { cash, card, transfer, other, description }: IPaymentType = payment;

        form.setFieldsValue({
          cash,
          card,
          transfer,
          other,
          description,
          supplierId: incomeProductsStore.incomeOrderPayment?.supplier?.id,
        });

        const totalPayCalc = cash + card + transfer + other;

        setTotalPayment(totalPayCalc);
      }
    }

    const totalPriceCalc = incomeProductsStore?.incomeOrder?.products?.reduce((prev, current) => prev + (current?.cost * current?.count), 0);

    setTotalPrice(totalPriceCalc || 0);
  }, [incomeProductsStore.incomeOrderPayment]);

  return (
    <Modal
      open={incomeProductsStore.isOpenIncomeOrderPaymentModal}
      title={`
        ${incomeProductsStore.incomeOrderPayment?.supplier?.fullname}: Yetkazib beruvchiga qarz
        ${incomeProductsStore.incomeOrderPayment?.supplier?.debt || 0}`}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      style={{ top: 0, padding: 0 }}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <Button
          onClick={handleSavePayment}
          type="primary"
          loading={loadingPayment}
          disabled={!isToday}
        >
          Maqullash
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={handleSubmitPayment}
        onValuesChange={handleValuesChange}
        layout="vertical"
        autoComplete="off"
        className="income-order__add-products-form-info"
      >
        <Form.Item
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="supplierId"
          initialValue={incomeProductsStore.incomeOrderPayment?.supplier?.id}
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            optionFilterProp="children"
            options={[{
              value: incomeProductsStore.incomeOrderPayment?.supplier?.id,
              label: `${incomeProductsStore.incomeOrderPayment?.supplier?.fullname} ${incomeProductsStore.incomeOrderPayment?.supplier?.phone}`,
            }]}
            allowClear
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
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'card')}
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
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'cash')}
              >
                Umumiy miqdor
              </Button>
            }
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
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'transfer')}
              >
                Umumiy miqdor
              </Button>
            }
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
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'other')}
              >
                Umumiy miqdor
              </Button>
            }
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
      <div>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Umumiy qiymati: {priceFormat(totalPrice)}
        </p>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Jami to&apos;lov: {priceFormat(totalPayment)}
        </p>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Qarzga: {priceFormat(Number(totalPrice) - Number(totalPayment) || 0)}
        </p>
      </div>
    </Modal>
  );
});
