import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Segmented, Typography} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import classNames from 'classnames';
import {currencyTagUi} from '@/constants/payment';
import {ISingleClientTabs, singleClientStore} from '@/stores/clients/single-client';
import {SegmentComponents, singleClientTabOptions} from './constants';
import styles from './single-client.scss';

const cn = classNames.bind(styles);

export const SingleClient = observer(() => {
  const {clientId} = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleClientStore.setActiveTabs(value as ISingleClientTabs);
  };

  useEffect(() => {
    if (clientId) {
      singleClientStore.getSingleClient({
        id: clientId,
        deedEndDate: singleClientStore.endDate!,
        deedStartDate: singleClientStore.startDate!,
      });
    }
  }, [clientId, singleClientStore.endDate, singleClientStore.startDate]);

  useEffect(() => () => {
    singleClientStore.reset();
  }, []);

  return (
    <main className="single-client-page">
      <div className={cn('single-client__head')}>
        <Segmented
          value={singleClientStore.activeTabs}
          onChange={handleChangeProductTab}
          options={singleClientTabOptions}
          className={cn('single-client__segment')}
        />

        <Typography.Title
          className={cn('single-client__title')}
          level={3}
        >
          Jami qarz: {singleClientStore?.activeClient?.debtByCurrency?.map(debt => (
            <span key={debt?.currency?.id}>{debt?.amount}{currencyTagUi(debt?.currency?.symbol)}</span>
          ))}
        </Typography.Title>
      </div>

      {SegmentComponents[singleClientStore?.activeTabs]}
    </main>
  );
});
