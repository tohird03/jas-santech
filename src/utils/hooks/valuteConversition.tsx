import React from 'react';
import {Form, Input, InputNumber, Select} from 'antd';
import {ICurrencyOptions} from '@/api/auth/types';
import {authStore} from '@/stores/auth';
import {priceFormat} from '../priceFormat';

type Props = {
  form: any;
  valueName: string;
  currencyName: string;
  label: string;
  required?: boolean;
  addonBefore?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currencyOptions: ICurrencyOptions[];
};

export const PriceWithCurrency = ({
  form,
  valueName,
  currencyName,
  label,
  required = false,
  addonBefore,
  onKeyDown,
  currencyOptions,
}: Props) => {
  const handleChange = (newCurrencyId: string, oldCurrencyId: string) => {
    const value = form.getFieldValue(valueName);

    const oldCurrency = currencyOptions.find(c => c.value === oldCurrencyId);
    const newCurrency = currencyOptions.find(c => c.value === newCurrencyId);

    if (!oldCurrency || !newCurrency || !value) return;

    const converted = (value * oldCurrency.rate) / newCurrency.rate;

    form.setFieldsValue({
      [valueName]: Math.round(converted * 1000) / 1000,
      [currencyName]: newCurrencyId,
    });
  };

  return (
    <Form.Item label={label} required={required}>
      <Input.Group style={{display: 'flex'}} compact>
        {addonBefore}

        <Form.Item
          name={valueName}
          noStyle
          rules={required ? [{required: true}] : []}
        >
          <InputNumber
            formatter={(value) => priceFormat(value!)}
            placeholder="0"
            style={{width: '70%'}}
            onKeyDown={onKeyDown}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const currentCurrency =
              form.getFieldValue(currencyName) || authStore?.staffInfo?.currency?.id;

            return (
              <Form.Item
                name={currencyName}
                initialValue={authStore?.staffInfo?.currency?.id}
                noStyle
              >
                <Select
                  style={{width: '30%'}}
                  options={currencyOptions}
                  value={currentCurrency}
                  onChange={(val) =>
                    handleChange(val, currentCurrency)
                  }
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
};
