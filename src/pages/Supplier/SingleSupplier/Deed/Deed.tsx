import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, DatePicker, DatePickerProps, Table, Typography } from 'antd';
import classNames from 'classnames';
import { useMediaQuery } from '@/utils/mediaQuery';
import { deedColumns } from './constants';
import { useParams } from 'react-router-dom';
import styles from './deed.scss';
import { singleSupplierStore} from '@/stores/supplier';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { supplierInfoApi } from '@/api/supplier/supplier';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const { supplierId } = useParams();
  const [downloadLoadingDeed, setDownLoadLoadingDeed] = useState(false);
  const [downloadLoadingDeedProduct, setDownLoadLoadingDeedProduct] = useState(false);

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleSupplierStore.setStartDate(null);
    }
    singleSupplierStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleSupplierStore.setEndDate(null);
    }
    singleSupplierStore.setEndDate(new Date(dateString));
  };

  const handleDownloadExcelDeed = () => {
    setDownLoadLoadingDeed(true);
    supplierInfoApi.getUploadDeedToExel({
      id: supplierId!,
      deedStartDate: singleSupplierStore?.startDate!,
      deedEndDate: singleSupplierStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'deed.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeed(false);
      });
  };

  const handleDownloadExcelDeedProducts = () => {
    setDownLoadLoadingDeedProduct(true);
    supplierInfoApi.getUploadDeedToExelWithProducts({
      id: supplierId!,
      deedStartDate: singleSupplierStore?.startDate!,
      deedEndDate: singleSupplierStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'deed.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeedProduct(false);
      });
  };

  return (
    <main>
      <div className={cn('deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('deed__filter')}>
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(singleSupplierStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(singleSupplierStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleDownloadExcelDeed}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeed}
          >
            Exelda Yuklash
          </Button>
          <Button
            onClick={handleDownloadExcelDeedProducts}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeedProduct}
          >
            Mahsulotlar bilan yuklash
          </Button>
        </div>
      </div>

      <Table
        columns={deedColumns}
        dataSource={singleSupplierStore?.activeSupplier?.deedInfo?.deeds || []}
        bordered
        summary={(pageData) => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'center' }}>
                  {priceFormat(singleSupplierStore?.activeSupplier?.deedInfo?.totalDebit)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'center' }}>
                  {priceFormat(singleSupplierStore?.activeSupplier?.deedInfo?.totalCredit)}
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} index={2}>
                <div style={{ textAlign: 'center' }}>
                  {priceFormat(singleSupplierStore?.activeSupplier?.deedInfo?.debt)}
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />
    </main>
  );
});
