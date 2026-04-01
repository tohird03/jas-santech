import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import { addNotification } from '@/utils';
import { authStore } from '@/stores/auth';

export const CloseDay: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: closeDay } =
    useMutation({
      mutationKey: ['closeDay'],
      mutationFn: () => authApi.closeDay(),
      onSuccess: () => {
        authStore.getCloseDayType();
        handleCancel();
      },
      onError: addNotification,
    });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    closeDay();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {authStore?.staffInfo?.phone === '998981157574' &&
        <span onClick={showModal} className="logout">
          <Button style={{ width: '100%' }} type="primary" danger>Kunni yopish</Button>
        </span>
      }
      <Modal
        title={'Rostdan ham bugungi kunni yopmoqchimisiz?'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yopish"
        okButtonProps={{ style: { backgroundColor: 'red' } }}
        cancelText="Bekor qilish"
      />
    </div>
  );
});
