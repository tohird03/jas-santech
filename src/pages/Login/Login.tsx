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
import ProductImg from '/public/images/sas-product.jpg';

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
    <main>
      {/* <BackgroundAnimate count={20} /> */}
      <section className={cn('login')}>
        <div className={cn('login__logo')}>
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="600px"
            viewBox="0 0 1280.000000 644.000000"
            preserveAspectRatio="xMidYMid meet"
          >

            <g
              transform="translate(0.000000,644.000000) scale(0.100000,-0.100000)"
              fill="#f0f0f0"
              stroke="none"
            >
              <path
                d="M0 3220 l0 -3220 6400 0 6400 0 0 3220 0 3220 -6400 0 -6400 0 0
-3220z m2988 2410 c512 -84 917 -393 1101 -839 l30 -72 -70 75 c-94 101 -172
158 -304 222 -187 90 -396 134 -640 134 -152 0 -236 -13 -350 -51 -175 -60
-329 -156 -465 -290 -197 -195 -283 -395 -284 -664 0 -149 12 -201 76 -329 69
-138 75 -146 557 -725 84 -101 159 -199 167 -217 8 -18 14 -63 14 -99 0 -122
-83 -236 -205 -283 -68 -26 -108 -27 -172 -6 -87 29 -54 -7 -613 668 -113 136
-237 291 -277 343 -118 157 -228 391 -284 603 -30 116 -33 346 -5 465 69 297
224 547 456 739 142 118 291 202 457 260 270 93 520 114 811 66z m10 -1160
c36 -24 95 -87 191 -205 151 -184 380 -463 441 -535 145 -173 178 -215 234
-300 118 -177 212 -393 252 -577 23 -104 23 -300 0 -416 -47 -244 -163 -461
-350 -656 -209 -217 -461 -352 -788 -423 -86 -18 -135 -22 -298 -22 -245 0
-389 23 -590 96 -337 122 -621 379 -774 702 -63 131 -67 151 -19 90 195 -245
551 -388 968 -389 216 0 331 26 510 115 265 132 490 376 559 608 45 154 53
373 16 482 -54 159 -129 276 -350 540 -259 308 -387 465 -414 507 -85 128 -4
324 166 404 34 15 60 19 118 17 66 -3 81 -7 128 -38z m4827 -159 c33 -15 79
-47 103 -72 23 -24 177 -233 342 -464 l300 -420 -33 -28 c-47 -42 -199 -113
-301 -142 -87 -25 -156 -32 -156 -17 0 4 -46 74 -102 154 -57 81 -145 208
-196 283 -51 74 -96 135 -100 135 -4 0 -13 -10 -21 -22 -8 -13 -55 -81 -106
-153 -50 -71 -129 -184 -175 -250 -352 -504 -367 -523 -458 -582 -62 -40 -136
-69 -128 -50 14 35 46 150 57 205 28 147 -27 278 -150 361 -112 75 -72 71
-728 64 -639 -7 -670 -5 -789 46 -118 50 -192 132 -223 247 -17 63 -15 268 4
337 34 129 111 223 228 280 141 68 129 67 989 66 425 -1 801 -4 835 -8 l62 -6
-147 -197 -147 -198 -616 0 -615 0 -41 -35 c-49 -42 -68 -83 -59 -130 14 -72
-11 -69 661 -75 586 -5 602 -6 666 -28 36 -12 84 -35 107 -52 23 -16 45 -30
49 -30 8 1 30 31 195 265 50 72 108 153 128 180 20 28 62 86 92 130 80 115
129 167 187 198 96 53 182 55 286 8z m3492 -21 l32 0 -106 -152 c-59 -84 -123
-176 -144 -204 l-37 -51 -324 -6 c-177 -4 -469 -10 -648 -14 l-325 -6 -92 -55
c-177 -106 -335 -264 -413 -412 -187 -357 -422 -574 -741 -684 -209 -71 -188
-69 -797 -73 l-552 -4 137 210 138 211 405 0 c398 0 406 1 460 23 173 72 382
289 580 602 169 267 320 413 536 517 112 53 219 84 334 96 41 4 401 6 800 4
399 -1 739 -2 757 -2z m-1571 -620 l56 -70 612 0 611 0 83 -29 c164 -57 291
-159 330 -264 43 -114 24 -208 -70 -348 -49 -72 -247 -295 -248 -278 0 3 10
32 21 65 30 83 38 276 15 339 -36 94 -117 168 -230 210 -48 17 -75 18 -620 6
l-571 -13 -185 82 c-102 45 -189 85 -193 89 -4 4 56 59 134 122 78 63 153 124
168 136 14 12 27 22 28 23 1 0 28 -31 59 -70z m1250 -560 c145 -109 150 -213
18 -342 -30 -29 -87 -72 -126 -95 l-73 -43 -812 0 -813 0 105 138 c58 75 129
167 157 205 l52 67 667 0 668 0 47 55 c26 30 50 55 52 55 3 0 29 -18 58 -40z
m-4272 -7 c81 -86 112 -188 82 -268 -20 -50 -84 -113 -150 -145 -42 -20 -53
-20 -880 -18 l-837 3 43 51 c24 28 92 111 151 183 l109 131 679 0 679 0 37 50
c20 28 41 50 45 50 3 0 23 -17 42 -37z"
              />
            </g>
          </svg>
        </div>
        <div style={{backgroundImage: `url(${ProductImg})`}} className={cn('login__form-wrapper')}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
            className={cn('login__form')}
          >
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true }]}
            >
              <PhoneInput
                country={'uz'}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true,
                  className: 'form__password-input form__phone-input',
                  autocomplete: 'off',
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <div className={cn('login__form__submit')}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block
                disabled={loading}
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </section>
    </main>
  );
});
