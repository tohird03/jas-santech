import './reminder.scss';

import React, {useState} from 'react';
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Spin, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {AxiosError} from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {useDebounce} from 'usehooks-ts';
import {clientsInfoApi} from '@/api/clients';
import {IReminder, IReminderForm, reminderApi} from '@/api/reminder';
import {ClientNameLink} from '@/pages/ActionComponents/ClientNameLink';
import {DataTable} from '@/components/Datatable/datatable';
import {addNotification} from '@/utils';
import {dateFormat} from '@/utils/getDateFormat';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {formatPhoneNumber} from '@/utils/phoneFormat';

interface ReminderFormValues {
  clientId: string;
  startDate: Dayjs;
  description: string;
}

export const Reminders = () => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [form] = Form.useForm<ReminderFormValues>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterClientId, setFilterClientId] = useState<string | undefined>();
  const [clientSearch, setClientSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IReminder | null>(null);
  const debouncedSearch = useDebounce(clientSearch, 400);

  const {data: reminders, isLoading} = useQuery({
    queryKey: ['reminders', pageNumber, pageSize, filterClientId],
    queryFn: () => reminderApi.getMany({
      pageNumber,
      pageSize,
      clientId: filterClientId,
    }),
  });

  const {data: clientsData, isLoading: clientsLoading} = useQuery({
    queryKey: ['reminderClients', debouncedSearch],
    queryFn: () => clientsInfoApi.getClientsInfo({
      pageNumber: 1,
      pageSize: 20,
      search: debouncedSearch,
    }),
  });

  const refresh = () => {
    queryClient.invalidateQueries({queryKey: ['reminders']});
  };

  const {mutate: removeReminder} = useMutation({
    mutationFn: (id: string) => reminderApi.deleteOne(id),
    onSuccess: () => {
      addNotification('Eslatma to\'xtatildi');
      refresh();
    },
    onError: (error) => addNotification(error as AxiosError),
  });

  const {mutate: saveReminder, isPending} = useMutation({
    mutationFn: (values: ReminderFormValues) => {
      const body: IReminderForm = {
        clientId: values.clientId,
        startDate: values.startDate.format('YYYY-MM-DD'),
        description: values.description.trim(),
      };

      if (editing) {
        return reminderApi.updateOne(editing.id, {
          startDate: body.startDate,
          description: body.description,
        });
      }

      return reminderApi.createOne(body);
    },
    onSuccess: () => {
      addNotification(editing ? 'Eslatma tahrirlandi' : 'Eslatma qo\'shildi');
      closeModal();
      refresh();
    },
    onError: (error) => addNotification(error as AxiosError),
  });

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (reminder: IReminder) => {
    setEditing(reminder);
    form.setFieldsValue({
      clientId: reminder.clientId,
      startDate: dayjs(reminder.startDate),
      description: reminder.description,
    });
    setOpen(true);
  };

  const searchedClients = (clientsData?.data?.data || []).map((item) => ({
    value: item.id,
    label: `${item.fullname} +${formatPhoneNumber(item.phone)}`,
  }));
  const clientOptions = editing && !searchedClients.some((item) => item.value === editing.clientId)
    ? [{
      value: editing.clientId,
      label: `${editing.client.fullname} +${formatPhoneNumber(editing.client.phone)}`,
    }, ...searchedClients]
    : searchedClients;

  const columns: ColumnType<IReminder>[] = [
    {
      key: 'index',
      title: '#',
      align: 'center',
      render: (_value, _record, index) => (pageNumber - 1) * pageSize + index + 1,
    },
    {
      key: 'client',
      title: 'Mijoz',
      align: 'center',
      width: 280,
      render: (_value, record) => (
        <ClientNameLink
          client={{
            id: record.client?.id || record.clientId,
            fullname: record.client?.fullname || '',
            phone: record.client?.phone,
          }}
          plain
        />
      ),
    },
    {
      key: 'startDate',
      title: 'Boshlanish sanasi',
      align: 'center',
      render: (_value, record) => dateFormat(record.startDate),
    },
    {
      key: 'description',
      title: 'Tavsif',
      align: 'center',
      dataIndex: 'description',
    },
    {
      key: 'lastSentOn',
      title: 'Oxirgi yuborilgan',
      align: 'center',
      render: (_value, record) => (record.lastSentOn ? dateFormat(record.lastSentOn) : 'hali yuborilmagan'),
    },
    {
      key: 'action',
      title: 'Amallar',
      align: 'center',
      render: (_value, record) => (
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Eslatmani o'chirish"
            description="Har kuni yuborish to'xtaydi."
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{style: {background: 'red'}}}
            onConfirm={() => removeReminder(record.id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <main>
      <div className="reminder-page__head">
        <Typography.Title level={3}>Eslatmalar</Typography.Title>
        <div className="reminder-page__filter">
          <Select
            className="reminder-page__client"
            showSearch
            allowClear
            filterOption={false}
            placeholder="Mijoz"
            value={filterClientId}
            options={clientOptions}
            loading={clientsLoading}
            onSearch={setClientSearch}
            onChange={(value) => {
              setFilterClientId(value);
              setPageNumber(1);
            }}
          />
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={openCreate}>
            Eslatma qo&apos;shish
          </Button>
        </div>
      </div>
      <DataTable
        rowKey="id"
        columns={columns}
        data={reminders?.data?.data || []}
        loading={isLoading}
        isMobile={isMobile}
        pagination={{
          total: reminders?.data?.totalCount,
          current: pageNumber,
          pageSize,
          showSizeChanger: true,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size || pageSize);
          },
          ...getPaginationParams(reminders?.data?.totalCount),
        }}
      />
      <Modal
        open={open}
        title={editing ? 'Eslatmani tahrirlash' : 'Eslatma qo\'shish'}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editing ? 'Saqlash' : 'Qo\'shish'}
        cancelText="Bekor qilish"
        confirmLoading={isPending}
        centered
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveReminder(values)}>
          <Form.Item name="clientId" label="Mijoz" rules={[{required: true}]}>
            <Select
              showSearch
              filterOption={false}
              placeholder="Mijoz"
              options={clientOptions}
              loading={clientsLoading}
              disabled={Boolean(editing)}
              onSearch={setClientSearch}
              notFoundContent={clientsLoading ? <Spin style={{margin: 10}} /> : null}
            />
          </Form.Item>
          <Form.Item name="startDate" label="Boshlanish sanasi" rules={[{required: true}]}>
            <DatePicker style={{width: '100%'}} format="DD.MM.YYYY" placeholder="Sanani tanlang" />
          </Form.Item>
          <Form.Item name="description" label="Tavsif" rules={[{required: true}]}>
            <Input.TextArea rows={3} maxLength={1000} placeholder="eslatma matni" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};
