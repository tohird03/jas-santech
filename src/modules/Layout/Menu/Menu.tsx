import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Badge, Menu as AntdMenu} from 'antd';
import {MenuProps} from 'antd/es/menu/menu';
import {ROUTES} from '@/constants';
import {useStores} from '@/stores';
import {chatBadgeStore} from '@/stores/chat/chat-badge';

type MenuNode = {
  key?: React.Key;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuNode[];
};

const withChatCount = (items: MenuProps['items']): MenuProps['items'] =>
  (items || []).map((item) => {
    if (!item || !('key' in item)) {
      return item;
    }

    const node = item as MenuNode;
    const key = String(node.key);
    const children = node.children ? withChatCount(node.children as MenuProps['items']) : undefined;
    const next = children ? {...item, children} : item;
    const count = key === ROUTES.clients || key === ROUTES.clientsChat ? chatBadgeStore.total : 0;

    if (!count) {
      return next;
    }

    return {
      ...next,
      icon: node.icon ? (
        <Badge count={count} size="small" className="menu-count menu-count--icon" offset={[6, 0]}>
          {node.icon}
        </Badge>
      ) : node.icon,
      label: (
        <span className="menu-count-label">
          <span className="menu-count-label__text">{node.label}</span>
          <Badge count={count} size="small" className="menu-count menu-count--label" />
        </span>
      ),
    };
  });

export const Menu = observer(() => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const {authStore} = useStores();
  const items = withChatCount(authStore?.mainMenuItems || []);

  const handleClick: MenuProps['onClick'] = ({key, domEvent}) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    navigate(key);
  };

  return (
    <AntdMenu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[pathname]}
      items={items}
      onClick={handleClick}
    />
  );
});
