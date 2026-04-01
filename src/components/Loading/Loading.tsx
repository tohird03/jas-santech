import './loader.scss';

import React from 'react';
import {Spin} from 'antd';

export const Loading = () => (
  <div className="loader">
    <div className="loader__logo">
      <Spin size="large" />
    </div>
  </div>
);
