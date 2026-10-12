import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Segmented, Typography} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import classNames from 'classnames';
import {currencyTagUi} from '@/constants/payment';
import {ISingleSupplierTabs, singleSupplierStore} from '@/stores/supplier';
import {SegmentComponents, singleSupplierTabOptions} from './constants';
import styles from './single-supplier.scss';

const cn = classNames.bind(styles);

export const SingleSupplier = observer(() => {
  const {supplierId} = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleSupplierStore.setActiveTabs(value as ISingleSupplierTabs);
  };

  useEffect(() => {
    if (supplierId) {
      singleSupplierStore.getSingleSupplier({
        id: supplierId,
        deedEndDate: singleSupplierStore?.endDate!,
        deedStartDate: singleSupplierStore?.startDate!,
      });
    }
  }, [supplierId, singleSupplierStore?.endDate, singleSupplierStore?.startDate]);

  useEffect(() => () => {
    singleSupplierStore.reset();
  }, []);

  return (
    <main className="single-supplier-page">
      <div className={cn('single-supplier__head')}>
        <Segmented
          value={singleSupplierStore.activeTabs}
          onChange={handleChangeProductTab}
          options={singleSupplierTabOptions}
          className={cn('single-supplier__segment')}
        />

        <Typography.Title
          className={cn('single-supplier__title')}
          level={3}
        >
          Yetkazib beruvchiga qarz: {
            singleSupplierStore?.activeSupplier?.debtByCurrency?.map(debt => (
              <span key={debt?.currency?.id}>
                {debt?.amount}{currencyTagUi(debt?.currency?.symbol)}
              </span>
            ))
          }
        </Typography.Title>
      </div>

      {SegmentComponents[singleSupplierStore?.activeTabs]}
    </main>
  );
});
