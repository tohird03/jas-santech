import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IOrderProducts} from '@/api/order/types';
import {productsListStore} from '@/stores/products';

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
