import React, { useState } from 'react';
import { Form, Input, InputNumber } from 'antd';


interface CustomFormItemProps {
  label: string;
  name: string;
  form: any;
  rules?: any;
  formatter: (value: any) => void;
  initialValue: number;
}

const CustomFormItem: React.FC<CustomFormItemProps> = ({ label, name, initialValue, form, rules }) => {
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());

  const handleInputChange = (input: string) => {
    const match = input.match(/^([+-]?\d+)?([+-])(\d+)?(=)?$/);

    if (match) {
      const baseValue = match[1] ? parseFloat(match[1]) : form.getFieldValue(name) || initialValue;
      const operator = match[2];
      const operand = match[3] ? parseFloat(match[3]) : 0;
      const equals = match[4];

      if (equals) {
        let result = baseValue;

        if (operator === '+') {
          result = baseValue + operand;
        } else if (operator === '-') {
          result = baseValue - operand;
        }
        form.setFieldsValue({ [name]: result });
        setInputValue(result.toString());
      } else {

        setInputValue(input);
      }
    } else {
      setInputValue(input);
    }
  };

  return (
    <Form.Item
      label={label}
      name={name}
      initialValue={initialValue}
      rules={rules}
    >
      <Input
        placeholder="Masalan: 10+12="
        style={{ width: '100%' }}
        onChange={(e) => handleInputChange(e.target.value)}
        value={inputValue}
      />
    </Form.Item>
  );
};

export { CustomFormItem };
