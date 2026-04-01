'use client';

import './layout.scss';

import React, {useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import {Layout as AntdLayout} from 'antd';
import {useBoolean} from 'usehooks-ts';
import {useMediaQuery} from '@/utils/mediaQuery';
import {Content} from './Content';
import {Header} from './Header';
import {Menu} from './Menu';

export const Layout = () => {
  const isTablet = useMediaQuery('(max-width: 1200px)');
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {value, setValue, toggle} = useBoolean(true);

  return (
    <AntdLayout className="layout" hasSider>
      <AntdLayout.Sider
        trigger={null}
        collapsible
        collapsed={value}
        width={250}
        style={isTablet ? {
          left: `${value && isMobile ? '-250px' : '0'}`,
          minWidth: '350px !important',
          height: 'calc(100vh - 64px)',
          position: 'absolute',
          marginTop: '64px',
          zIndex: '1',
        } : {}}
      >
        {!isTablet && (
          <div className="layout__logo">
            {!value && <span className="layout__logo-text">JAS</span>}
          </div>
        )}

        <div className="layout__menu"><Menu /></div>
      </AntdLayout.Sider>

      <AntdLayout className={value ? 'site-layout site-layout__close' : 'site-layout'}>
        <Header
          collapsed={value}
          onCollapsedClick={toggle}
          isMobile={isTablet}
        />

        <Content isTablet={value}>
          <Outlet />
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};
