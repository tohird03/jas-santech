import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Tooltip } from 'antd';
import { addNotification } from '@/utils';
import { returnedOrdersStore } from '@/stores/products';
import { IReturnedOrder } from '@/api/returned-order/types';
import { returnedOrderApi } from '@/api/returned-order/returned-order';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { authStore } from '@/stores/auth';

type Props = {
  returnedOrder: IReturnedOrder;
};

export const Action: FC<Props> = observer(({ returnedOrder }) => {
  const queryClient = useQueryClient();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { isCloseDay } = authStore;

  const today = new Date().toISOString().split('T')[0];
  const checkDate = returnedOrder?.date?.split('T')[0]?.split(' ')[0];
  const isToday = checkDate === today && !isCloseDay;

  const { mutate: deleteReturnedOrder } =
    useMutation({
      mutationKey: ['deleteReturnedOrder'],
      mutationFn: (id: string) => returnedOrderApi.deleteReturnedOrder(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
      },
      onError: addNotification,
    });

  const handleEditReturnedOrder = () => {
    returnedOrdersStore.setSingleReturnedOrder(returnedOrder);
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(true);
  };

  const handleDelete = () => {
    deleteReturnedOrder(returnedOrder?.id);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    returnedOrderApi.getUploadReturnedOrderToExel(returnedOrder?.id)
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${returnedOrder?.client?.fullname}, ${getFullDateFormat(returnedOrder?.createdAt)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const handleShowOrder = () => {
    returnedOrdersStore.setSingleReturnedOrder(returnedOrder);
    returnedOrdersStore.setIsOpenShowEditModal(true);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip placement="top" title="Qaytaruvni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
      <Button
        onClick={handleDownloadExcel}
        icon={<DownloadOutlined />}
        loading={downloadLoading}
      />
      {isToday &&
        <>
          <Button onClick={handleEditReturnedOrder} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="Qaytuvni o'chirish"
            description="Rostdan ham bu qaytuvni o'chirishni xohlaysizmi?"
            onConfirm={handleDelete}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      }
    </div>
  );
});
