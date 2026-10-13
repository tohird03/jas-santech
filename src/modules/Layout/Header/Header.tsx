import './header.scss';

import React from 'react';
import {observer} from 'mobx-react';
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Dropdown, Layout as AntdLayout, MenuProps, Typography} from 'antd';
import {useStores} from '@/stores';
import {CloseDay} from '../CloseDay';
import {DefaultCurrency} from '../DefaultCurrency';
import {LogOut} from '../LogOut/LogOut';

type Props = {
  collapsed: boolean;
  onCollapsedClick: () => void;
  isMobile?: boolean;
};

export const Header = observer(({collapsed, onCollapsedClick, isMobile}: Props) => {
  const {authStore} = useStores();

  const items: MenuProps['items'] = [
    ...(isMobile
      ? [{
        key: '2',
        label: (
          <>
            <Typography.Title level={5} style={{margin: '0'}}>
              {authStore.staffInfo?.fullname}
            </Typography.Title>
            <Typography.Title level={5} style={{margin: '0'}}>
              +{authStore.staffInfo?.phone}
            </Typography.Title>
          </>
        ),
      }] : []),
    {
      key: '1',
      label: <LogOut />,
    },
    {
      key: '2',
      label: <CloseDay />,
    },
  ];

  return (
    <AntdLayout.Header className={`header header__isclose-${authStore?.isCloseDay}`}>
      <div className="header__left">
        <Button type="text" onClick={onCollapsedClick}>
          {collapsed
            ? <MenuUnfoldOutlined className="header__icon" />
            : <MenuFoldOutlined className="header__icon" />}
        </Button>
        {!isMobile && authStore.isCloseDay && <span className="layout__logo-text">JAS || Kassa yopilgan</span>}
        {isMobile &&
          <span className="layout__logo-text">
            {authStore.isCloseDay ? 'Kun yopilgan' : 'JAS'}
          </span>
        }

        <div className="header__profile">
          <DefaultCurrency />
          <Dropdown menu={{items}} placement="bottomRight" trigger={['hover', 'click']}>
            <button type="button" className="header__user">
              <span className="header__who">
                <span className="header__name">{authStore.staffInfo?.fullname}</span>
                <span className="header__phone">
                  {authStore.staffInfo?.phone ? `+${authStore.staffInfo.phone}` : ''}
                </span>
              </span>
              <Avatar className="header__avatar" icon={<UserOutlined />} />
            </button>
          </Dropdown>
        </div>
      </div>
    </AntdLayout.Header>
  );
});
