import {makeAutoObservable} from 'mobx';
import {IStaff} from './types';

class ProfileStore {
  profileInfo: IStaff | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProfileInfo = (profileInfo: IStaff) => {
    this.profileInfo = profileInfo;
  };

  reset = () => {
    this.profileInfo = null;
  };
}

export const profileStore = new ProfileStore();
