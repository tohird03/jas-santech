import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Typography } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import { addNotification } from '@/utils';
import { authStore } from '@/stores/auth';
import { priceFormat } from '@/utils/priceFormat';
import { staffsApi } from '@/api/staffs';

export const DefaultCurrency: React.FC = observer(() => {
  const queryClient = useQueryClient();

  const { mutate: changeCurrency } =
    useMutation({
      mutationKey: ['changeCurrency'],
      mutationFn: (currencyId: string) => staffsApi.updateStaff({
        id: authStore?.staffInfo?.id,
        currencyId,
        actionsToConnect: [],
        actionsToDisconnect: [],
      }),
      onSuccess: () => {
        authStore.getProfile();
        addNotification('Valyuta birligi tanlandi');
      },
      onError: addNotification,
    });

  // GET DATAS
  const { data: currencyMany, isLoading: loadingClients } = useQuery({
    queryKey: ['getCurrencyMany'],
    queryFn: () =>
      authStore.getCurrencyMany(),
  });

  const handleCurrencyChange = (value: string) => {
    changeCurrency(value);
  };

  const currencyManyData = useMemo(() => (
    currencyMany?.data.map((currency) => ({
      value: currency?.id,
      label: `${currency?.symbol} | ${priceFormat(currency?.exchangeRate)}`,
    }))
  ), [currencyMany]);

  return (
    <div>
      <Select
        options={currencyManyData}
        style={{width: '130px'}}
        placeholder="Valyuta"
        value={authStore?.staffInfo?.currency?.id}
        onChange={handleCurrencyChange}
      />
    </div>
  );
});
