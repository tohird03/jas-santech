import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Image, Input, InputNumber, Modal, Select, Upload, UploadFile, UploadProps } from 'antd';
import { addNotification } from '@/utils';
import { productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { productsApi } from '@/api/product/product';
import { IAddEditProduct, IAddEditProductForm } from '@/api/product/types';
import { PriceWithCurrency } from '@/utils/hooks/valuteConversition';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import { UPLOAD_ACCEPT } from '@/constants/img';
import { authStore } from '@/stores/auth';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const { data: currencyMany, isLoading: loadingClients } = useQuery({
    queryKey: ['getCurrencyMany'],
    queryFn: () =>
      authStore.getCurrencyMany(),
  });

  const { mutate: addNewProduct } =
    useMutation({
      mutationKey: ['addNewProduct'],
      mutationFn: (params: IAddEditProduct) => productsApi.addNewProduct(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const { mutate: updateProduct } =
    useMutation({
      mutationKey: ['updateProduct'],
      mutationFn: (params: IAddEditProduct) => productsApi.updateProduct(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleBeforeUpload = () => false;

  const handleImgChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setBannerFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();

        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleSubmit = (values: IAddEditProductForm) => {
    setLoading(true);

    const productData = {
      name: values?.name,
      count: 0,
      minAmount: values?.minAmount,
      description: values?.description,
      prices: {
        cost: {
          price: values?.cost,
          currencyId: values?.costCurrency,
        },
        selling: {
          price: values?.price,
          currencyId: values?.priceCurrency,
        },
        wholesale: {
          price: values?.wholesale,
          currencyId: values?.wholesaleCurrency,
        },
      },
    };

    if (productsListStore?.singleProduct) {
      updateProduct({
        ...productData,
        id: productsListStore?.singleProduct?.id!,
      });

      return;
    }
    addNewProduct(productData);
  };

  const handleModalClose = () => {
    productsListStore.setSingleProduct(null);
    productsListStore.setIsOpenAddEditProductModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const currencyManyData = useMemo(() => (
    currencyMany?.data.map((currency) => ({
      value: currency?.id,
      label: `${currency?.symbol} | ${priceFormat(currency?.exchangeRate)}`,
      code: currency?.symbol,
      rate: currency?.exchangeRate,
    })) || []
  ), [currencyMany]);

  useEffect(() => {
    if (productsListStore.singleProduct) {
      form.setFieldsValue({
        ...productsListStore.singleProduct,
      });
    }
  }, [productsListStore.singleProduct]);

  return (
    <Modal
      open={productsListStore.isOpenAddEditProductModal}
      title={productsListStore.singleProduct ? 'Mahsulotni tahrirlash' : 'Mahsulotni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={productsListStore.singleProduct ? 'Mahsulotni tahrirlash' : 'Mahsulotni qo\'shish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Rasm"
          name="images"
        >
          <Upload
            maxCount={1}
            onPreview={handlePreview}
            beforeUpload={handleBeforeUpload}
            onChange={handleImgChange}
            fileList={bannerFileList}
            listType="picture-card"
            accept={UPLOAD_ACCEPT}
          >
            {bannerFileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div>
                  Upload
                </div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>

        <Form.Item
          label="Mahsulot nomi"
          rules={[{ required: true }]}
          name="name"
        >
          <Input placeholder="Mahsulot nomi" />
        </Form.Item>
        <Form.Item
          label="Ogohlantiruvchi qoldiq"
          name="minAmount"
        >
          <InputNumber
            placeholder="Ushbu sondan kam qolgan mahsulot haqida sizni ogohlantiramiz!"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <PriceWithCurrency
          form={form}
          valueName="cost"
          currencyName="costCurrency"
          label="Sotib olingan narxi"
          required
          currencyOptions={currencyManyData}
        />

        <PriceWithCurrency
          form={form}
          valueName="wholesale"
          currencyName="wholesaleCurrency"
          label="Ulgurji narxi"
          required
          currencyOptions={currencyManyData}
        />

        <PriceWithCurrency
          form={form}
          valueName="price"
          currencyName="priceCurrency"
          label="Sotish narxi"
          required
          currencyOptions={currencyManyData}
        />

        <Form.Item
          label="Mahsulot haqida ma'lumot"
          name="description"
        >
          <Input.TextArea
            placeholder="Mahsulot haqida ma'lumot"
            style={{ width: '100%' }}
            rows={4}
            maxLength={100}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
