import React, {useMemo} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Select} from 'antd';
import {staffsApi} from '@/api/staffs';
import {authStore} from '@/stores/auth';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';

export const DefaultCurrency: React.FC = observer(() => {
  const {mutate: changeCurrency} =
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
  const {data: currencyMany} = useQuery({
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
        className="header-currency"
        placeholder="Valyuta"
        value={authStore?.staffInfo?.currency?.id}
        onChange={handleCurrencyChange}
      />
    </div>
  );
});
