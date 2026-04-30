import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {addNotification} from '@/utils';
import { IProducts } from '@/api/product/types';
import { productsListStore } from '@/stores/products';
import { productsApi } from '@/api/product/product';

type Props = {
  product: IProducts;
};

export const Action: FC<Props> = observer(({product}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteClient} =
  useMutation({
    mutationKey: ['deleteClient'],
    mutationFn: (id: string) => productsApi.deleteProduct(id!),
    onSuccess: () => {
      addNotification('Mahsulot o\'chirildi');
      queryClient.invalidateQueries({queryKey: ['getProducts']});
    },
    onError: addNotification,
  });

  const handleEditProduct = () => {
    productsListStore.setSingleProduct(product);
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleDelete = () => {
    deleteClient(product?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProduct} type="primary" icon={<EditOutlined />} />
      {/* <Popconfirm
        title="Mahsulotni o'chirish"
        description="Rostdan ham bu Mahsulotni o'chirishni xohlaysizmi?"
        onConfirm={handleDelete}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm> */}
    </div>
  );
});
