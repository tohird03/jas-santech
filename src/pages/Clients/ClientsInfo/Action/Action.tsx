import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {clientsInfoApi, IClientsInfo} from '@/api/clients';
import {clientsInfoStore} from '@/stores/clients';
import {addNotification} from '@/utils';

type Props = {
  client: IClientsInfo;
};

export const Action: FC<Props> = observer(({client}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteClient} =
  useMutation({
    mutationKey: ['deleteClient'],
    mutationFn: (id: string) => clientsInfoApi.deleteClient(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getClients']});
    },
    onError: addNotification,
  });

  const handleEditProcess = () => {
    clientsInfoStore.setSingleClientInfo(client);
    clientsInfoStore.setIsOpenAddEditClientModal(true);
  };

  const handleDelete = () => {
    deleteClient(client?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Xodimni o'chirish"
        description="Rostdan ham bu xodimni o'chirishni xohlaysizmi?"
        onConfirm={handleDelete}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
