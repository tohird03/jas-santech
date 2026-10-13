import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IProducts} from '@/api/product/types';
import {productsListStore} from '@/stores/products';

type Props = {
  product: IProducts;
};

export const Action: FC<Props> = observer(({product}) => {
  const handleEditProduct = () => {
    productsListStore.setSingleProduct(product);
    productsListStore.setProductId(product?.id);
    productsListStore.setIsOpenAddEditProductModal(true);
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
