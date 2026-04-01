import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, MoreOutlined, PrinterOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import { addNotification } from '@/utils';
import { IOrder} from '@/api/order/types';
import { ordersStore } from '@/stores/products';
import { ordersApi } from '@/api/order';
import Item from 'antd/es/list/Item';

type Props = {
  orders: IOrder;
};

import { MyDocument } from './Pdf-save';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { useParams } from 'react-router-dom';
import { singleClientStore } from '@/stores/clients';
import { isShowEdit } from '@/utils/isShowEdit';
import { authStore } from '@/stores/auth';

export const Action: FC<Props> = observer(({ orders }) => {
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { mutate: deleteOrder } =
    useMutation({
      mutationKey: ['deleteOrder'],
      mutationFn: (id: string) => ordersApi.deleteOrder(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });

        if (clientId) {
          singleClientStore.getSingleClient({id: clientId});
        }
      },
      onError: addNotification,
    });

  const handleShowOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setIsOpenShowOrderModal(true);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    ordersApi.getUploadOrderToExel({
      startDate: ordersStore?.startDate!,
      endDate: ordersStore?.endDate!,
      orderId: orders?.id,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${orders?.client?.fullname}, ${getFullDateFormat(orders?.date)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const handlePrint = () => {
    const doc = <MyDocument order={orders} />;

    pdf(doc).toBlob().then((blob) => {
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');

      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
    });
  };

  const handleEditOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setOrder(orders);
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDelete = () => {
    deleteOrder(orders?.id);
  };

  const showEdit = isShowEdit(orders.status, orders.date, authStore.isCloseDay);

  const menuSaveOptions = (
    <Menu style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Item key="excel">
        <Button
          onClick={handleDownloadExcel}
          icon={<DownloadOutlined />}
          loading={downloadLoading}
        >
          Excelda yuklash
        </Button>
      </Item>
      <Item key="check">
        <Button
          onClick={handlePrint}
          icon={<PrinterOutlined />}
        >
          Chekka chiqarish
        </Button>
      </Item>
      <Item key="check">
        <PDFDownloadLink
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '4px 15px',
            fontWeight: '500',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
          }}
          document={<MyDocument order={orders} />}
          fileName={orders?.client?.fullname}
        >
          <DownloadOutlined style={{ marginRight: '10px' }} /> Pdfda yuklash
        </PDFDownloadLink>
      </Item>
    </Menu>
  );

  const menuOrderOptions = (
    <Menu style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Item key="edit">
        <Button onClick={handleEditOrder} icon={<EditOutlined />} >
          Sotuvni tahrirlash
        </Button>
      </Item>
      <Item key="delete">
        <Popconfirm
          title="Sotuvni o'chirish"
          description="Rostdan ham bu sotuvni o'chirishni xohlaysizmi?"
          onConfirm={handleDelete}
          okText="Ha"
          okButtonProps={{ style: { background: 'red' } }}
          cancelText="Yo'q"
        >
          <Button icon={<DeleteOutlined />} danger >
            Sotuvni o&lsquo;chirish
          </Button>
        </Popconfirm>
      </Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip placement="top" title="Sotuvni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
      <Dropdown placement="bottomRight" overlay={menuSaveOptions} trigger={['click']}>
        <Button icon={<DownloadOutlined />} />
      </Dropdown>
      {showEdit && (
        <Dropdown placement="bottomRight" overlay={menuOrderOptions} trigger={['click']}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      )
      }
    </div>
  );
});
