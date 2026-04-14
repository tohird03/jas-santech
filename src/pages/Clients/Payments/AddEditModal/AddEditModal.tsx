import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Spin, message } from 'antd';
import { observer } from 'mobx-react';
import { ordersStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { IPaymentType } from '@/api/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsInfoStore, paymentsStore, singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import { authStore } from '@/stores/auth';
import { PaymentTypeOptions, currencyTagUi } from '@/constants/payment';
import { PaymentTypes } from '@/constants/types';
import { calculateSettlement } from '../../utils';
import { IClientsInfo } from '@/api/clients';

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [prevCurrencies, setPrevCurrencies] = useState<Record<number, string>>({});
  const paymentsForm = Form.useWatch('payments', form) || [];
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<IClientsInfo | null>(null);

  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchClients],
    queryFn: () =>
      clientsInfoStore.getClients({
        pageNumber: 1,
        pageSize: 15,
        search: searchClients!,
      }),
  });

  const { data: currencyMany } = useQuery({
    queryKey: ['getCurrencyMany'],
    queryFn: () =>
      authStore.getCurrencyMany(),
  });

  const handleModalClose = () => {
    paymentsStore.setSinglePayment(null);
    paymentsStore.setIsOpenAddEditPaymentModal(false);
  };

  const handleSavePayment = () => {
    form.submit();
  };

  const handleSubmitPayment = (values: IPaymentType) => {
    console.log(values);

    // setLoadingPayment(true);

    // ordersApi.updateOrder({
    //   id: ordersStore?.order?.id!,
    //   send: ordersStore.isSendUser,
    //   clientId: form.getFieldValue('clientId'),
    //   payment: values,
    // })
    //   .then(() => {
    //     queryClient.invalidateQueries({ queryKey: ['getOrders'] });
    //     if (clientId) {
    //       singleClientStore.getSingleClient({ id: clientId });
    //     }
    //     handleModalClose();
    //   })
    //   .catch(addNotification)
    //   .finally(() => {
    //     setLoadingPayment(false);
    //   });
  };

  const handleSearchClients = (value: string) => {
    setSearchClients(value);
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  const handleChangeClient = (value: IClientsInfo) => {
    setSelectedClient(value);
  };

  const groupedPayments = useMemo(() => {
    const payments = form.getFieldValue('payments') || [];

    return payments.reduce((acc: any, p: any) => {
      if (!p.currencyId) return acc;

      if (!acc[p.currencyId]) {
        acc[p.currencyId] = {
          currencyId: p.currencyId,
          total: 0,
        };
      }

      acc[p.currencyId].total += Number(p.amount || 0);

      return acc;
    }, {});
  }, [paymentsForm]);

  const paymentTotals = useMemo(() =>
    Object.values(groupedPayments).map((item: any) => {
      const currency = currencyMany?.data.find(c => c.id === item.currencyId);

      return {
        currencyId: item.currencyId,
        total: item.total,
        symbol: currency?.symbol, // USD / UZS
      };
    }), [groupedPayments, currencyMany]);

  const settlement = useMemo(() => {
    if (!ordersStore.order || !currencyMany?.data) {
      return {
        debt: { uzs: 0, usd: 0 },
        payment: { uzs: 0, usd: 0 },
        order: { uzs: 0, usd: 0 },
        change: { uzs: 0, usd: 0, default: 0 },
      };
    }

    return calculateSettlement(
      ordersStore.order,
      paymentsForm,
      currencyMany.data,
      authStore.staffInfo?.currency?.symbol || 'UZS'
    );
  }, [ordersStore.order, currencyMany, paymentsForm]);

  const handleCurrencyChange = (newCurrencyId: string, index: number) => {
    const payments = form.getFieldValue('payments') || [];
    const current = payments[index];

    if (!current) return;

    const oldCurrencyId = prevCurrencies[index];
    const oldCurrency = currencyManyData.find(c => c.value === oldCurrencyId);
    const newCurrency = currencyManyData.find(c => c.value === newCurrencyId);

    if (!oldCurrency || !newCurrency) return;

    let newAmount = current.amount;

    if (current.amount) {
      if (oldCurrency.code === 'USD' && newCurrency.code === 'UZS') {
        newAmount = current.amount * oldCurrency.rate;
      } else if (oldCurrency.code === 'UZS' && newCurrency.code === 'USD') {
        newAmount = current.amount / newCurrency.rate;
      }
    }

    const finalAmount = Math.round(newAmount * 100) / 100;

    form.setFields([
      {
        name: ['payments', index, 'amount'],
        value: finalAmount,
      },
      {
        name: ['payments', index, 'currencyId'],
        value: newCurrencyId,
      },
    ]);
  };

  // QAYTIM
  const uzsChange = Form.useWatch('uzsChange', form) || 0;
  const usdChange = Form.useWatch('usdChange', form) || 0;

  useEffect(() => {
    form.setFieldsValue({
      uzsChange: settlement.change.uzs || 0,
      usdChange: settlement.change.usd || 0,
      uzsCash: 0,
      usdCash: 0,
    });
  }, [settlement]);

  const handleChangeUpdate = (type: 'uzs' | 'usd', newValue: number) => {
    const base = settlement.change[type];

    const diff = Math.max(0, base - newValue);

    form.setFieldsValue({
      [`${type}Cash`]: diff,
    });
  };

  const handleCashChange = (type: 'uzs' | 'usd', cashValue: number) => {
    const base = settlement.change[type];

    const clientValue = Math.max(0, base - cashValue);

    form.setFieldsValue({
      [`${type}Change`]: clientValue,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      uzsChange: settlement.change.uzs > 0 ? settlement.change.uzs : undefined,
      usdChange: settlement.change.usd > 0 ? settlement.change.usd : undefined,
    });
  }, [settlement]);

  const clientsOptions = useMemo(() => (
    clientsData?.data?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.fullname}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  const currencyManyData = useMemo(() => (
    currencyMany?.data.map((currency) => ({
      value: currency?.id,
      label: `${currency?.symbol} | ${priceFormat(currency?.exchangeRate)}`,
      code: currency.symbol,
      rate: currency.exchangeRate,
    })) || []
  ), [currencyMany]);

  return (
    <Modal
      open={paymentsStore.isOpenAddEditPaymentModal}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <p style={{ margin: 0 }}>
            To&apos;lov
          </p>
          <p style={{ margin: 0 }}>
            {paymentsStore?.singlePayment?.user?.debtByCurrency[0] && `Mijoz qarzi: ${paymentsStore?.singlePayment?.user?.debtByCurrency?.map(debt => (
              <span key={debt?.currency?.id}>
                {debt?.amount}{currencyTagUi(debt?.currency?.symbol)}
              </span>
            ))}`}
          </p>
        </div>
      }
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      keyboard
      style={{ top: 0, padding: '20px' }}
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
        >
          Maqullash
        </Button>
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '30px',
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmitPayment}
          layout="vertical"
          autoComplete="off"
          className="order__payment-form"
          initialValues={{
            payments: [
              {
                amount: 0,
                type: PaymentTypes.CASH,
                currencyId: authStore?.staffInfo?.currency?.id,
              },
            ],
          }}
        >
          <Form.Item
            label="Mijoz"
            rules={[{ required: true }]}
            name="userId"
            initialValue={ordersStore.orderPayment?.client?.id}
          >
            <Select
              showSearch
              placeholder="Mijoz"
              loading={loadingClients}
              optionFilterProp="children"
              notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
              filterOption={filterOption}
              onSearch={handleSearchClients}
              onClear={handleClearClient}
              onChange={(value) => {
                const client = clientsData?.data?.data?.find((client) => client.id === value);

                if (client) {
                  handleChangeClient(client);
                }
              }}
              options={clientsOptions}
              allowClear
            />
          </Form.Item>
          <Form.List name="payments">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name }) => (
                  <div
                    key={key}
                    style={{ display: 'flex', marginBottom: 10 }}
                  >
                    <Form.Item
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Turini tanlang' }]}
                      style={{ width: '20%' }}
                    >
                      <Select
                        placeholder="To'lov turi"
                        options={PaymentTypeOptions}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'amount']}
                      rules={[{ required: true, message: 'Summa kiriting' }]}
                      style={{ width: '40%' }}
                    >
                      <InputNumber
                        key={form.getFieldValue(['payments', name, 'currencyId'])}
                        style={{ width: '100%' }}
                        formatter={(value) => priceFormat(value!)}
                        placeholder="0"
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'currencyId']}
                      initialValue={authStore?.staffInfo?.currency?.id}
                      rules={[{ required: true, message: 'Valyuta tanlang' }]}
                      style={{ width: '25%' }}
                    >
                      <Select
                        options={currencyManyData}
                        onMouseDown={() => {
                          const payments = form.getFieldValue('payments') || [];

                          setPrevCurrencies(prev => ({
                            ...prev,
                            [name]: payments[name]?.currencyId,
                          }));
                        }}
                        onChange={(val) => handleCurrencyChange(val, name)}
                      />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      O‘chirish
                    </Button>
                  </div>
                ))}

                <Button
                  type="primary"
                  block
                  onClick={() =>
                    add({
                      amount: 0,
                      type: PaymentTypes.CASH,
                      currencyId: authStore?.staffInfo?.currency?.id,
                    })
                  }
                >
                  + To‘lov qo‘shish
                </Button>
              </div>
            )}
          </Form.List>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card style={{ background: '#F5F5F5' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '20px' }}>
              <p style={{ margin: '0' }}>Umumiy qarzi:</p>
              <div style={{ textAlign: 'end' }}>
                {selectedClient?.debtByCurrency?.map(price =>
                  <div key={price?.currency?.id}>{priceFormat(price?.amount)}{currencyTagUi(price?.currency?.symbol)}</div>)}
              </div>
            </div>
          </Card>
          <Card style={{ background: '#F5F5F5' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '20px' }}>
                <p style={{ margin: '0' }}>To&apos;lov:</p>
                <div style={{ textAlign: 'end' }}>
                  {paymentTotals?.map(price =>
                    <div key={price?.currencyId}>{priceFormat(price?.total)}{currencyTagUi(price.symbol!)}</div>)}
                </div>
              </div>
            </div>
          </Card>
          <Card style={{ background: '#F5F5F5' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '20px' }}>
                <p style={{ margin: '0' }}>Qarzga:</p>
                <div style={{ textAlign: 'end' }}>
                  <div>{priceFormat(settlement?.debt?.uzs)}{currencyTagUi('UZS')}</div>
                  <div>{priceFormat(settlement?.debt?.usd)}{currencyTagUi('USD')}</div>
                </div>
              </div>
            </div>
          </Card>
          <Card style={{ background: '#F5F5F5' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '20px' }}>
                <p style={{ margin: '0' }}>Qaytim:</p>
                <div style={{ textAlign: 'end' }}>
                  <div>{priceFormat(settlement?.change?.uzs)}{currencyTagUi('UZS')}</div>
                  <div>{priceFormat(settlement?.change?.usd)}{currencyTagUi('USD')}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Form form={form}>
        {(settlement.change.uzs > 0 || settlement.change.usd > 0) && (
          <div style={{ marginTop: 20 }}>
            <h3>Mijoz hisobidan ayirish</h3>

            {settlement.change.uzs > 0 && (
              <Form.Item
                name="uzsChange"
                label="UZS"
                initialValue={settlement.change.uzs}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => priceFormat(value)}
                  onChange={(val) => handleChangeUpdate('uzs', Number(val || 0))}
                />
              </Form.Item>
            )}

            {settlement.change.usd > 0 && (
              <Form.Item
                name="usdChange"
                label="USD"
                initialValue={settlement.change.usd}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => priceFormat(value)}
                  onChange={(val) => handleChangeUpdate('usd', Number(val || 0))}
                />
              </Form.Item>
            )}
          </div>
        )}

        {uzsChange < settlement.change.uzs && (
          <Form.Item name="uzsCash" label="Kassadan berish UZS">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={settlement.change.uzs}
              formatter={(v) => priceFormat(v)}
              onChange={(val) => handleCashChange('uzs', Number(val || 0))}
            />
          </Form.Item>
        )}

        {settlement.change.usd > 0 && usdChange < settlement.change.usd && (
          <Form.Item name="usdCash" label="Kassadan berish USD">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={settlement.change.usd}
              formatter={(v) => priceFormat(v)}
              onChange={(val) => handleCashChange('usd', Number(val || 0))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
});
