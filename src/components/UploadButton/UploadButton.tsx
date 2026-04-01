import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import classnamesBind from 'classnames/bind';
import styles from './upload-button.scss';

const cn = classnamesBind.bind(styles);

export const UploadButton = () => (
  <div>
    <PlusOutlined />
    <div className={cn('upload-button')}>Upload</div>
  </div>
);
