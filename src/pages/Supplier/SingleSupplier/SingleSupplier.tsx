import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Segmented, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { SegmentComponents, singleSupplierTabOptions } from './constants';
import { useParams } from 'react-router-dom';
import styles from './single-supplier.scss';
import classNames from 'classnames';
import { ISingleSupplierTabs, singleSupplierStore } from '@/stores/supplier';

const cn = classNames.bind(styles);

export const SingleSupplier = observer(() => {
  const { supplierId } = useParams();

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
    <main>
      <div className={cn('single-supplier__head')}>
        <Segmented
          defaultValue={ISingleSupplierTabs.ORDER}
          onChange={handleChangeProductTab}
          options={singleSupplierTabOptions}
          className={cn('single-supplier__segment')}
        />

        <Typography.Title
          className={cn('single-client__title')}
          level={3}
        >
          Yetkazib beruvchiga qarz: {singleSupplierStore?.activeSupplier?.debt}
        </Typography.Title>
      </div>

      {SegmentComponents[singleSupplierStore?.activeTabs]}
    </main>
  );
});
