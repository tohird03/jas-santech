import { ordersApi } from '@/api/order';
import { IOrder } from '@/api/order/types';
import { addNotification } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

interface Props {
  order: IOrder;
}

export const OrderDescUpdate: React.FC<Props> = ({order}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');

  const onSave = (text: string) => {
    ordersApi.updateOrder({
      id: order?.id!,
      send: false,
      description: text,
    })
      .then(() => {
        addNotification('Tahrirlandi');
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      })
      .catch(addNotification);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(value);
  };

  const handleCancel = () => {
    setValue(order?.description);
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(order?.description);
  }, [order?.description]);

  return (
    <div style={{ minHeight: '40px' }}>
      {isEditing ? (
        <textarea
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }

            if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          style={{
            width: '100%',
            minHeight: '60px',
            resize: 'none',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid grey !important',
          }}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '6px',
          }}
        >
          {value || <span style={{ color: '#999' }}>Izoh yo‘q...</span>}
        </div>
      )}
    </div>
  );
};
