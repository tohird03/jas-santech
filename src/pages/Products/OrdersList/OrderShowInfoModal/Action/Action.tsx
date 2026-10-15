import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {addNotification} from '@/utils';
import { IProducts } from '@/api/product/types';
import { productsListStore } from '@/stores/products';
import { productsApi } from '@/api/product/product';
import { IOrderProducts } from '@/api/order/types';

type Props = {
  product: IOrderProducts;
};

export const ActionShowProduct: FC<Props> = observer(({product}) => {

  const handleEditProduct = () => {
    // productsListStore.setSingleProduct(product?.product);
    productsListStore.setProductId(product?.product?.id);
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProduct} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
