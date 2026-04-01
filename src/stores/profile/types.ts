import { ISeller } from '@/api/clients';
import { EPageAccess } from '@/api/staffs';

export interface IStaff extends ISeller {
  permissions: IPemissions[];
  role: 'admin' | 'super_admin';
  pages: EPageAccess[];
}

export interface IPemissions {
  id: string;
  key: EPageAccess;
  name: string;
  description: string;
  actions: IPemissions[];
}

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
};
