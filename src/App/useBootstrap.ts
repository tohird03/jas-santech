import {useEffect, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {useStores} from '@/stores';
import {TokenType} from '@/stores/auth';

export const useBootstrap = () => {
  const {authStore} = useStores();
  const [isInitiated, setIsInitiated] = useState(true);
  const [accessToken] = useLocalStorage<TokenType['accessToken']>('accessToken', '');

  const getInfosApp = async () => {
    authStore.getCloseDayType();
    authStore.getProfile();
  };

  const setToken = async () => {
    if (accessToken) {
      authStore.setIsAuth(true);
      await authStore.setToken({accessToken});

      await getInfosApp();
    }
  };


  const getAppConfigs = async () => {
    try {
      await setToken();

      setIsInitiated(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAppConfigs();
  }, []);

  return [isInitiated];
};
