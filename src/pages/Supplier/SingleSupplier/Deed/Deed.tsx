import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DownloadOutlined} from '@ant-design/icons';
import {Button, DatePicker, DatePickerProps, Table, Typography} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import {supplierInfoApi} from '@/api/supplier/supplier';
import {ISupplierDeed} from '@/api/supplier/types';
import {DataTable} from '@/components/Datatable/datatable';
import {currencyTagUi} from '@/constants/payment';
import {singleSupplierStore} from '@/stores/supplier';
import {addNotification} from '@/utils';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {deedColumns} from './constants';
import styles from './deed.scss';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const {supplierId} = useParams();
  const isMobile = useMediaQuery('(max-width: 800px)');
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
      <div className={cn('supplier-deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('supplier-deed__filter')}>
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
            Excelga yuklash
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

      {isMobile ? (
        <>
          <div className="deed__total">
            <div>
              <span>Jami debet</span>
              <b>
                {singleSupplierStore?.activeSupplier?.deedInfo?.totalDebitByCurrency?.map(debt => (
                  <span key={debt?.currency?.id}>
                    {priceFormat(debt?.amount)}
                    {currencyTagUi(debt?.currency?.symbol)}
                  </span>
                ))}
              </b>
            </div>
            <div>
              <span>Jami kredit</span>
              <b>
                {singleSupplierStore?.activeSupplier?.deedInfo?.totalCreditByCurrency?.map(debt => (
                  <span key={debt?.currency?.id}>
                    {priceFormat(debt?.amount)}
                    {currencyTagUi(debt?.currency?.symbol)}
                  </span>
                ))}
              </b>
            </div>
            <div>
              <span>Umumiy farq</span>
              <b>
                {singleSupplierStore?.activeSupplier?.deedInfo?.debtByCurrency?.map(debt => (
                  <span key={debt?.currency?.id}>
                    {priceFormat(debt?.amount)}
                    {currencyTagUi(debt?.currency?.symbol)}
                  </span>
                ))}
              </b>
            </div>
          </div>
          <DataTable
            className="deed-cards"
            isMobile
            columns={deedColumns}
            data={(singleSupplierStore?.activeSupplier?.deedInfo?.deeds || []).map((item, index) => ({
              ...item,
              id: `${item.date}-${item.action}-${index}`,
            }))}
            rowClassName={(record: ISupplierDeed) => (
              record?.type === 'debit' ? 'deed-card-debit' : 'deed-card-credit'
            )}
            pagination={false}
          />
        </>
      ) : (
        <Table
          columns={deedColumns}
          dataSource={singleSupplierStore?.activeSupplier?.deedInfo?.deeds || []}
          bordered
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} index={0}>
                Jami
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <div style={{textAlign: 'center'}}>
                    {singleSupplierStore?.activeSupplier?.deedInfo?.totalDebitByCurrency?.map(debt => (
                      <div key={debt?.currency?.id}>
                        {priceFormat(debt?.amount)}
                        {currencyTagUi(debt?.currency?.symbol)}
                      </div>
                    ))
                    }
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <div style={{textAlign: 'center'}}>
                    {singleSupplierStore?.activeSupplier?.deedInfo?.totalCreditByCurrency?.map(debt => (
                      <div key={debt?.currency?.id}>
                        {priceFormat(debt?.amount)}
                        {currencyTagUi(debt?.currency?.symbol)}
                      </div>
                    ))
                    }
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2} index={2}>
                  <div style={{textAlign: 'center'}}>
                    {singleSupplierStore?.activeSupplier?.deedInfo?.debtByCurrency?.map(debt => (
                      <div key={debt?.currency?.id}>
                        {priceFormat(debt?.amount)}
                        {currencyTagUi(debt?.currency?.symbol)}
                      </div>
                    ))
                    }
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
          pagination={false}
        />
      )}
    </main>
  );
});
