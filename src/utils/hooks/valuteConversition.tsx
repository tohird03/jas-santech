import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { DEFAULTVALUTE, OPTIONVALUTE, PRICEUSDVALUE } from '@/constants';
import { priceFormat } from '../priceFormat';
import { BaseOptionType } from 'antd/es/select';
import { authStore } from '@/stores/auth';
import { ICurrency, ICurrencyOptions } from '@/api/auth/types';

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

const convertPrice = (value: number, priceUsdValue: number, from: string, to: string) => {
  if (!value) return value;

  let result = value;

  if (from === 'USD' && to === 'UZS') {
    result = value * priceUsdValue;
  }

  if (from === 'UZS' && to === 'USD') {
    result = value / priceUsdValue;
  }

  return Math.round(result * 1000) / 1000;
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
      <Input.Group style={{ display: 'flex' }} compact>
        {addonBefore}

        <Form.Item
          name={valueName}
          noStyle
          rules={required ? [{ required: true }] : []}
        >
          <InputNumber
            formatter={(value) => priceFormat(value!)}
            placeholder="0"
            style={{ width: '70%' }}
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
                  style={{ width: '30%' }}
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
