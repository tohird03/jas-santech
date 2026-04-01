import React from 'react';
import {StopOutlined} from '@ant-design/icons';
import {Result} from 'antd';
import classNames from 'classnames/bind';
import styles from './not-found.scss';

const cn = classNames.bind(styles);

export const NotFound = () => (
  <div className={cn('not-found')}>
    <Result
      title="Empty data"
      subTitle="This bag is empty"
      icon={<StopOutlined />}
    />
  </div>
);
