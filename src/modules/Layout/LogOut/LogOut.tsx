import './logout.scss';

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {LogoutOutlined} from '@ant-design/icons';
import {Button, Modal, Typography} from 'antd';
import {useLocalStorage} from 'usehooks-ts';
import {ROUTES} from '@/constants';
import {resetStores} from '@/stores';
import {TokenType} from '@/stores/auth';
import {logOutDictionary} from './dictionary';

export const LogOut: React.FC = observer(() => {
  const [, setAccessToken] = useLocalStorage<TokenType['accessToken']>('accessToken', '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    resetStores();
    setAccessToken('');
    setIsModalOpen(false);
    navigate(ROUTES.signIn);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <span onClick={showModal} className="logout">
        <Button style={{width: '100%'}} type="primary">Chiqish</Button>
      </span>
      <Modal
        title={logOutDictionary.exit}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <span>{logOutDictionary.logOut}</span>
      </Modal>
    </div>
  );
});
