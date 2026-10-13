import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Table, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {resizableTableProps, useResizableColumns} from '@/components/Datatable/use-resizable-columns';
import {currencyStore} from '@/stores/workers';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import {clientsColumns} from './constants';
import styles from './currency.scss';

const cn = classNames.bind(styles);

const currencyColumnKeys = ['index', 'name', 'rate', 'actions'];
const currencyColumnTitles = [
  {key: 'index', title: '#'},
  {key: 'name', title: 'Valyuta'},
  {key: 'rate', title: 'Qiymat'},
  {key: 'actions', title: 'Amallar'},
];
const currencyDefaultWidths = {
  index: 64,
  name: 280,
  rate: 200,
  actions: 120,
};
const currencyMinWidths = {
  index: 56,
  name: 120,
  rate: 120,
  actions: 112,
};

export const Currency = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {boxRef, apply, picker} = useResizableColumns({
    keys: currencyColumnKeys,
    defaults: currencyDefaultWidths,
    mins: currencyMinWidths,
    titles: currencyColumnTitles,
  });
  const columns = apply(clientsColumns);
  const {data: currencyData, isLoading: loading} = useQuery({
    queryKey: ['getCurrency'],
    queryFn: () =>
      currencyStore.getCurrency(),
  });

  useEffect(() => () => {
    currencyStore.reset();
  }, []);

  return (
    <main ref={boxRef} className="currency-page">
      <div className={cn('currency__head')}>
        <Typography.Title level={3}>Valyuta</Typography.Title>
        {picker}
      </div>

      {isMobile ? (
        <DataTable
          className="currency-cards"
          isMobile
          columns={columns}
          data={currencyData?.data?.data || []}
          loading={loading}
        />
      ) : (
        <Table
          {...resizableTableProps}
          columns={columns}
          dataSource={currencyData?.data?.data || []}
          loading={loading}
        />
      )}

      {currencyStore.isOpenEditCurrency && <AddEditModal />}
    </main>
  );
});
