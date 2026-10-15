import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Collapse, Form, Input, InputNumber, Modal } from 'antd';
import { EPageAccess, IAddStaff, IUpdateStaff, staffsApi } from '@/api/staffs';
import { staffsStore } from '@/stores/workers';
import { addNotification } from '@/utils';
import { regexPhoneNumber } from '@/utils/phoneFormat';
import { roleApi } from '@/api/role';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { EPageAccessLabel } from '../constants';

export const AddStaffsModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [userPer, setUserPer] = useState<string[]>([]);
  const [oldPer, setOldPer] = useState<string[]>([]);
  const [userPageAccess, setUserPageAccess] = useState<EPageAccess[]>([]);
  const [oldPageAccess, setOldPageAccess] = useState<EPageAccess[]>([]);

  const { data: permissionsData } = useQuery({
    queryKey: ['getPermissions'],
    queryFn: () => roleApi.getAllPermissions(),
  });

  const { mutate: addNewStaffs } =
    useMutation({
      mutationKey: ['addNewStaffs'],
      mutationFn: (params: IAddStaff) => staffsApi.addNewStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] });
        handleModalClose();
        addNotification('Xodim muvaffaqiyatli qo\'shildi');
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const { mutate: updateStaffs } =
    useMutation({
      mutationKey: ['updateStaffs'],
      mutationFn: (params: IUpdateStaff) => staffsApi.updateStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] });
        addNotification('Xodim muvaffaqiyatli o\'zgartirildi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalClose = () => {
    staffsStore.setSingleStaff(null);
    staffsStore.setIsOpenAddEditStaffModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddStaff) => {
    setLoading(true);

    if (staffsStore?.singleStaff) {
      const connectPer = userPer?.filter(newPer => !oldPer?.includes(newPer));
      const disconnectPer = oldPer?.filter(newPer => !userPer?.includes(newPer));
      const connectPage = userPageAccess?.filter(newPage => !oldPageAccess?.includes(newPage));
      const disconnectPage = oldPageAccess?.filter(newPage => !userPageAccess?.includes(newPage));

      updateStaffs({
        fullname: values?.fullname,
        password: values?.password,
        phone: `998${values?.phone}`,
        id: staffsStore?.singleStaff?.id!,
        actionsToConnect: connectPer,
        actionsToDisconnect: disconnectPer,
        pagesToConnect: connectPage,
        pagesToDisconnect: disconnectPage,
      });

      return;
    }
    addNewStaffs({
      ...values,
      actionsToConnect: userPer,
      pagesToConnect: userPageAccess,
      phone: `998${values?.phone}`,
    });
  };

  const handleChangePer = (e: CheckboxChangeEvent, perId: string) => {
    const findOldAssignPer = userPer?.find((per) => per === perId);

    if (e?.target?.checked && !findOldAssignPer) {
      setUserPer([...userPer, perId]);
    } else if (findOldAssignPer) {
      const filterPer = userPer?.filter((per) => per !== perId);

      setUserPer(filterPer);
    }
  };

  const handleChangePageAccess = (e: CheckboxChangeEvent, pageAccess: EPageAccess) => {
    const findOldAssignPage = userPageAccess?.find((page) => page === pageAccess);

    if (e?.target?.checked && !findOldAssignPage) {
      setUserPageAccess([...userPageAccess, pageAccess]);
    } else if (findOldAssignPage) {
      const filterPageAccess = userPageAccess?.filter((page) => page !== pageAccess);

      setUserPageAccess(filterPageAccess);
    }
  };

  useEffect(() => {
    if (staffsStore.singleStaff) {
      staffsApi?.getSingleStaffs(staffsStore?.singleStaff?.id)
        .then(res => {
          form.setFieldsValue({
            ...res?.data,
            phone: res?.data?.phone?.slice(3),
          });
          const checkPer = res?.data?.actions?.map(per => per?.id);

          setUserPer(checkPer);
          setOldPer(checkPer);
          setUserPageAccess(res?.data?.pages);
          setOldPageAccess(res?.data?.pages);
        });
    }
  }, [staffsStore.singleStaff]);

  return (
    <Modal
      open={staffsStore.isOpenAddEditStaffModal}
      title={staffsStore.singleStaff ? 'Xodimni tahrirlash' : 'Xodimni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={staffsStore.singleStaff ? 'Xodimni tahrirlash' : 'Xodimni qo\'shish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="fullname"
          label="Xodim"
          rules={[{ required: true }]}
        >
          <Input placeholder="F.I.O" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefon raqami: 901234567"
          rules={[
            { required: true },
            {
              pattern: regexPhoneNumber,
              message: 'Raqamni to\'g\'ri kiriting!, Masalan: 901234567',
            },
          ]}
        >
          <InputNumber
            addonBefore="+998"
            placeholder="Telefon raqami"
            style={{ width: '100%' }}
            type="number"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Parolni kiriting"
        >
          <Input.Password placeholder="Parolni kiriting" />
        </Form.Item>
        <Form.Item
          name="reset-password"
          label="Parolni qayta kiriting"
          rules={[
            {
              validator(rule, value) {
                if (value !== form.getFieldValue('password')) {
                  return Promise.reject('Parollar bir-biriga mos emas');
                } else {
                  return Promise.resolve();
                }
              },
              message: 'Parollar bir-biriga mos emas',
            },
          ]}
        >
          <Input.Password
            placeholder="Parolni qayta kiriting"
          />
        </Form.Item>
      </Form>
      <Collapse
        size="small"
        items={[
          {
            key: 'page-access',
            label: 'Sahifalarga kirish huquqi',
            children: (
              <>
                {Object.values(EPageAccess).map((access) => (
                  <Checkbox
                    key={access}
                    checked={userPageAccess.includes(access)}
                    onChange={(e) => handleChangePageAccess(e, access)}
                    style={{ display: 'flex', paddingLeft: 20 }}
                  >
                    {EPageAccessLabel[access]}
                  </Checkbox>
                ))}
              </>
            ),
          },
        ]}
      />
      {permissionsData?.data?.data?.map(role => (
        <div key={role?.id}>
          <Collapse
            size="small"
            items={[{
              key: role?.id,
              label: role?.name,
              children:
                role?.actions?.map((per) => (
                  <Checkbox
                    onChange={(e) => handleChangePer(e, per?.id)}
                    key={per?.id}
                    style={{ display: 'flex', paddingLeft: '20px' }}
                    checked={userPer?.includes(per?.id)}
                  >
                    {per?.description}
                  </Checkbox>
                )),
            }]}
          />
        </div>
      ))
      }
    </Modal>
  );
});
