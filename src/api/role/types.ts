export interface IRole {
  id: string;
  name: string;
  key: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: string;
  name: string;
  key: string;
}
