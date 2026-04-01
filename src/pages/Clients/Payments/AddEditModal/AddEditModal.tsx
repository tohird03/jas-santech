import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select, Spin } from 'antd';
import { clientsInfoStore, paymentsStore } from '@/stores/clients';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { clientsPaymentApi } from '@/api/payment';
import { IAddEditPaymentParams } from '@/api/payment/types';
import { IClientsInfo } from '@/api/clients';

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<IClientsInfo | null>(null);

  // GET DATAS
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchClients],
    queryFn: () =>
      clientsInfoStore.getClients({
        pageNumber: 1,
        pageSize: 15,
        search: searchClients!,
      }),
  });

  const handleSubmit = (values: IAddEditPaymentParams) => {
    setLoading(true);

    if (paymentsStore?.singlePayment) {
      clientsPaymentApi.updatePayment({
        ...values,
        id: paymentsStore?.singlePayment?.id,
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

    clientsPaymentApi.addPayment(values)
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
    paymentsStore.setSinglePayment(null);
    paymentsStore.setIsOpenAddEditPaymentModal(false);
  };

  const handleModalOk = () => {
    form.submit();
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

  const clientsOptions = useMemo(() => (
    clientsData?.data?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.fullname}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (paymentsStore.singlePayment) {
      setSearchClients(paymentsStore?.singlePayment?.user?.phone);

      form.setFieldsValue({
        ...paymentsStore.singlePayment,
        userId: paymentsStore?.singlePayment?.user?.id,
      });
    }
  }, [paymentsStore.singlePayment]);

  console.log(selectedClient);

  return (
    <Modal
      open={paymentsStore.isOpenAddEditPaymentModal}
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {paymentsStore.singlePayment ? 'To\'lovni tahrirlash' : 'To\'lov qo\'shish'}
          <p style={{ margin: 0 }}>{selectedClient && `Mijoz qarzi: ${priceFormat(selectedClient?.debt)}`}</p>
        </div>
      )}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={paymentsStore.singlePayment ? 'To\'lovni tahrirlash' : 'To\'lov qo\'shish'}
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
          label="Mijoz"
          rules={[{ required: true }]}
          name="userId"
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
