import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation} from '@tanstack/react-query';
import {Button, Modal} from 'antd';
import {authApi} from '@/api';
import {authStore} from '@/stores/auth';
import {addNotification} from '@/utils';

export const CloseDay: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {mutate: closeDay} =
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
      {authStore?.staffInfo?.phone === '998917732299' &&
        <span onClick={showModal} className="logout">
          <Button style={{width: '100%'}} type="primary" danger>Kunni yopish</Button>
        </span>
      }
      <Modal
        title={'Rostdan ham bugungi kunni yopmoqchimisiz?'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yopish"
        okButtonProps={{style: {backgroundColor: 'red'}}}
        cancelText="Bekor qilish"
      />
    </div>
  );
});
