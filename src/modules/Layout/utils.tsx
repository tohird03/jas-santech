import React from 'react';
import { MenuProps } from 'antd';
import { IMenuItems } from './types';
import { IStaff } from '@/stores/profile/types';

export type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => ({
  label,
  key,
  icon,
  children,
} as MenuItem);

export const generateAllMenuItems = (list: IMenuItems[] | undefined, staff: IStaff): MenuProps['items'] =>
  list
    ?.map((item) => {
      if (staff?.role === 'super_admin') {
        return item;
      }

      const hasPageAccess = staff.pages?.some(page => page === item?.roleKey);

      if (!item.children && !hasPageAccess) {
        return null;
      }

      const filteredChildren = item.children
        ? generateAllMenuItems(item.children, staff)!.filter(subItem => subItem !== null)
        : [];

      if (filteredChildren.length > 0 || hasPageAccess) {
        return getItem(
          <div className="sidebar-links">{item?.label}</div>,
          item.key,
          item.icon,
          filteredChildren.length > 0 ? filteredChildren : undefined
        );
      }

      return null;
    })
    .filter(item => item !== null) as MenuItem[];

