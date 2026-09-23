import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Popconfirm } from 'antd';

import { IStaffs, staffsApi } from '@/api/staffs';
import { staffsStore } from '@/stores/workers';
import { addNotification } from '@/utils';

type Props = {
  staff: IStaffs;
};

export const ActiveStatus: FC<Props> = observer(({ staff }) => {
  const queryClient = useQueryClient();

  const { mutate: updateStaff, isPending } = useMutation({
    mutationKey: ['updateStaff'],
    mutationFn: (data: {isActive: boolean}) =>
      staffsApi.updateStaff({
        id: staff?.id,
        isActive: data.isActive,
        actionsToConnect: [],
        actionsToDisconnect: [],
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getStaffs'],
      });

      addNotification(
        variables.isActive
          ? 'Xodim faollashtirildi'
          : 'Xodim o‘chirildi'
      );
    },
    onError: addNotification,
  });

  const handleActiveChange = (checked: boolean) => {
    updateStaff({
      isActive: checked,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Popconfirm
        title={
          staff.isActive
            ? 'Xodimni faolsizlantirmoqchimisiz?'
            : 'Xodimni faollashtirmoqchimisiz?'
        }
        onConfirm={() => handleActiveChange(!staff.isActive)}
        okText="Ha"
        cancelText="Yo‘q"
      >
        <Checkbox
          checked={staff.isActive}
          disabled={isPending}
        />
      </Popconfirm>
    </div>
  );
});
