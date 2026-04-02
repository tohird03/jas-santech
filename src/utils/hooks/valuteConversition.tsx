import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { DEFAULTVALUTE, OPTIONVALUTE, PRICEUSDVALUE } from '@/constants';
import { priceFormat } from '../priceFormat';

type Props = {
  form: any;
  valueName: string;
  currencyName: string;
  label: string;
  required?: boolean;
};

const convertPrice = (value: number, from: string, to: string) => {
  if (!value) return value;

  let result = value;

  if (from === 'USD' && to === 'UZS') {
    result = value * PRICEUSDVALUE;
  }

  if (from === 'UZS' && to === 'USD') {
    result = value / PRICEUSDVALUE;
  }

  return Math.round(result * 1000) / 1000;
};


export const PriceWithCurrency = ({
  form,
  valueName,
  currencyName,
  label,
  required = false,
}: Props) => {
  const handleChange = (newCurrency: string, oldCurrency: string) => {
    const value = form.getFieldValue(valueName);

    const converted = convertPrice(value, oldCurrency, newCurrency);

    form.setFieldsValue({
      [valueName]: converted,
      [currencyName]: newCurrency,
    });
  };

  return (
    <Form.Item label={label} required={required}>
      <Input.Group compact>
        <Form.Item
          name={valueName}
          noStyle
          rules={required ? [{ required: true }] : []}
        >
          <InputNumber
            formatter={(value) => priceFormat(value!)}
            placeholder="0"
            style={{ width: '70%' }}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const currentCurrency =
              form.getFieldValue(currencyName) || DEFAULTVALUTE;

            return (
              <Form.Item
                name={currencyName}
                initialValue={DEFAULTVALUTE}
                noStyle
              >
                <Select
                  style={{ width: '30%' }}
                  options={OPTIONVALUTE}
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
