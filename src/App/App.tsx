import '../styles/global.scss';

import React, {FC} from 'react';
import {HashRouter} from 'react-router-dom';
import {observer, Provider} from 'mobx-react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConfigProvider} from 'antd';
import {Loading} from '@/components';
import {Router} from '@/router';
import {stores, useStores} from '@/stores';
import {Theme as AntdTheme} from '@/styles/theme';
import {useBootstrap} from './useBootstrap';

const queryClient = new QueryClient();

export const App: FC = observer(() => {
  const {authStore} = useStores();
  const [isInitiated] = useBootstrap();

  if (isInitiated) {
    return <Loading />;
  }

  return (
    <QueryClientProvider
      client={queryClient}
    >
      <Provider {...stores}>
        <ConfigProvider csp={{nonce: 'woodline'}} theme={AntdTheme}>
          <HashRouter>
            <Router isAuth={authStore.isAuth} />
          </HashRouter>
        </ConfigProvider>
      </Provider>
    </QueryClientProvider>
  );
});
