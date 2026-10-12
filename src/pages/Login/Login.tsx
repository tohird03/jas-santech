'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import classNames from 'classnames';
import { useLocalStorage } from 'usehooks-ts';
import { ILoginForm } from '@/api/auth/types';
import { ROUTES } from '@/constants';
import { authStore, TokenType } from '@/stores/auth';
import { addNotification } from '@/utils/addNotification';
import styles from './login.scss';
// @ts-ignore
import 'react-phone-input-2/lib/style.css';
// @ts-ignore
import PhoneInput from 'react-phone-input-2';
import JasImg from '/public/images/jas-logo.jpg';

const cn = classNames.bind(styles);

export const Login = observer(() => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [, setAccessToken] = useLocalStorage<TokenType['accessToken']>('accessToken', '');

  const handleSubmit = (values: ILoginForm) => {
    setLoading(true);

    authStore.getSignIn(values)
      .then(res => {
        if (res?.data) {
          setAccessToken(res?.data?.data?.tokens?.accessToken);
          navigate(ROUTES.productsOrder);
          addNotification('Success login');
          authStore.getProfile();
        }
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className={cn('login')}>
      <aside className={cn('login__side')}>
        <img className={cn('login__logo')} src={JasImg} alt="JAS" />
      </aside>
      <section className={cn('login__panel')}>
        <div className={cn('login__box')}>
          <h1 className={cn('login__title')}>Kirish</h1>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
            className={cn('login__form')}
          >
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{required: true, message: 'Telefon raqamini kiriting'}]}
            >
              <PhoneInput
                country={'uz'}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true,
                  className: 'form__password-input form__phone-input',
                  autoComplete: 'off',
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Parol"
              rules={[{required: true, message: 'Parolni kiriting'}]}
            >
              <Input.Password
                placeholder="Parol"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Button
              className={cn('login__submit')}
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={loading}
            >
              Kirish
            </Button>
          </Form>
        </div>
      </section>
    </main>
  );
});
