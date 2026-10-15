import './content.scss';

import React from 'react';
import {Layout as AntdLayout} from 'antd';

type Props = {
  children: React.ReactNode;
  isTablet: boolean;
};

export const Content = ({children, isTablet}: Props) => (
  <AntdLayout.Content className={isTablet ? 'tablet__content content' : 'content'}>
    {children}
  </AntdLayout.Content>
);
