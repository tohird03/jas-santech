import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from '@tanstack/react-query';
import { Table, Typography } from 'antd';
import classNames from 'classnames';
import { AddEditModal } from './AddEditModal';
import styles from './currency.scss';
import { clientsColumns } from './constants';
import { currencyStore } from '@/stores/workers';

const cn = classNames.bind(styles);

export const Currency = observer(() => {
  const { data: currencyData, isLoading: loading } = useQuery({
    queryKey: ['getCurrency'],
    queryFn: () =>
      currencyStore.getCurrency(),
  });

  useEffect(() => () => {
    currencyStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('currency__head')}>
        <Typography.Title level={3}>Valyuta</Typography.Title>
      </div>

      <Table
        columns={clientsColumns}
        dataSource={currencyData?.data?.data || []}
        loading={loading}
      />

      {currencyStore.isOpenEditCurrency && <AddEditModal />}
    </main>
  );
});
