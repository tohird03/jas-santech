import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal} from 'antd';
import {clientsInfoStore} from '@/stores/clients';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import { IAddEditClientInfo, IUpdateUser, clientsInfoApi } from '@/api/clients';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addNewStaffs} =
    useMutation({
      mutationKey: ['addNewStaffs'],
      mutationFn: (params: IAddEditClientInfo) => clientsInfoApi.addClients(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getClients']});
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
      mutationFn: (params: IAddEditClientInfo) => clientsInfoApi.updateClient(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getClients']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddEditClientInfo) => {
    const valueControl = {
      ...values,
      phone: `998${values?.phone}`,
    };

    setLoading(true);

    if (clientsInfoStore?.singleClientInfo) {
      updateClient({
        ...valueControl,
        id: clientsInfoStore?.singleClientInfo?.id!,
      });

      return;
    }
    addNewStaffs(valueControl);
  };

  const handleModalClose = () => {
    clientsInfoStore.setSingleClientInfo(null);
    clientsInfoStore.setIsOpenAddEditClientModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (clientsInfoStore.singleClientInfo) {
      form.setFieldsValue({
        ...clientsInfoStore.singleClientInfo,
        phone: clientsInfoStore.singleClientInfo?.phone?.slice(3),
      });
    }
  }, [clientsInfoStore.singleClientInfo]);

  return (
    <Modal
      open={clientsInfoStore.isOpenAddEditClientModal}
      title={clientsInfoStore.singleClientInfo ? 'Mijozni tahrirlash' : 'Mijozni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={clientsInfoStore.singleClientInfo ? 'Mijozni tahrirlash' : 'Mijozni qo\'shish'}
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
          name="fullname"
          label="Mijoz"
          rules={[{required: true}]}
        >
          <Input placeholder="F.I.O" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefon raqami: 901234567"
          rules={[
            {required: true},
            {
              pattern: regexPhoneNumber,
              message: 'Raqamni to\'g\'ri kiriting!, Masalan: 901234567',
            },
          ]}
        >
          <InputNumber
            addonBefore="+998"
            placeholder="Telefon raqami"
            style={{width: '100%'}}
            type="number"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
