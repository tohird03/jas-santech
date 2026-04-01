import { makeAutoObservable, observable } from 'mobx';
import { MenuProps } from 'antd';
import { authApi } from '@/api';
import { ILoginForm } from '@/api/auth/types';
import { addNotification } from '@/utils/addNotification';
import { IStaff } from '../profile/types';
import { TokenType } from './types';
import { generateAllMenuItems } from '@/modules/Layout/utils';
import { mainMenuList } from '@/modules/Layout/constants';

class AuthStore {
  isAuth: boolean | null = false;
  token: TokenType | null = null;
  staffInfo: IStaff | null = null;
  mainMenuItems: MenuProps['items'] | null = null;
  isCloseDay = false;

  constructor() {
    makeAutoObservable(this, {
      isAuth: observable,
    });
  }

  getSignIn = (params: ILoginForm) =>
    authApi.getSignIn(params)
      .then(res => {
        if (res?.data) {
          this.setToken({
            accessToken: res?.data?.data?.tokens?.accessToken,
          });
          this.setIsAuth(true);
        }

        return res;
      })
      .catch(addNotification);

  getProfile = () =>
    authApi.getUserProfile()
      .then(res => {
        if (res) {
          this.mainMenuItems = generateAllMenuItems(mainMenuList, res?.data);
          this.setStaffInfo(res?.data);
        }
      })
      .catch(addNotification);

  getCloseDayType = () =>
    authApi.getCloseDay()
      .then(res =>
        this.setIsCloseDay(res?.data?.isClosed))
      .catch(err => {
        addNotification(err);
      });

  setMainMenuItems = (menuItems: MenuProps['items'] | null) => {
    this.mainMenuItems = menuItems;
  };

  setStaffInfo = (staffInfo: IStaff) => {
    this.staffInfo = staffInfo;
  };

  setToken = (token: TokenType) => {
    this.token = token;
  };

  setIsAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };

  setIsCloseDay = (isCloseDay: boolean) => {
    this.isCloseDay = isCloseDay;
  };

  reset = () => {
    this.isAuth = null;
    this.token = null;
    this.staffInfo = null;
    window.localStorage.clear();
  };
}

export const authStore = new AuthStore();
