import {ReactNode} from 'react';

export interface IMenuItems {
  children?: IMenuItems[] | [];
  icon: ReactNode;
  key: string;
  label: string;
  parent?: IMenuItems['key'];
}
