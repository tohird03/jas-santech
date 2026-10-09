import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {resizableTableProps, useResizableColumns} from '@/components/Datatable/use-resizable-columns';
import {staffsStore} from '@/stores/workers';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddStaffsModal} from './AddStaffsModal';
import {staffsColumns} from './constants';
import styles from './staffs.scss';

const cn = classNames.bind(styles);

const columnKeys = ['index', 'name', 'phone', 'active', 'actions'];
const columnTitles = [
  {key: 'index', title: '#'},
  {key: 'name', title: 'Xodim'},
  {key: 'phone', title: 'Telefon raqami'},
  {key: 'active', title: 'Faolligi'},
  {key: 'actions', title: 'Amallar'},
];
const defaultWidths = {
  index: 64,
  name: 520,
  phone: 210,
  active: 130,
  actions: 120,
};
const minWidths = {
  index: 56,
  name: 160,
  phone: 150,
  active: 110,
  actions: 112,
};

export const Staffs = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {boxRef, apply, picker} = useResizableColumns({
    keys: columnKeys,
    defaults: defaultWidths,
    mins: minWidths,
    titles: columnTitles,
  });

  const {data: staffsData, isLoading: loading} = useQuery({
    queryKey: [
      'getStaffs',
      staffsStore.pageNumber,
      staffsStore.pageSize,
      staffsStore.search,
    ],
    queryFn: () =>
      staffsStore.getStaffs({
        pageNumber: staffsStore.pageNumber,
        pageSize: staffsStore.pageSize,
        search: staffsStore.search!,
      }),
  });

  const handleAddNewStaff = () => {
    staffsStore.setIsOpenAddEditStaffModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    staffsStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    staffsStore.setPageNumber(page);
    staffsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    staffsStore.reset();
  }, []);

  const columns = apply(staffsColumns);

  return (
    <main ref={boxRef}>
      <div className={cn('staffs__head')}>
        <Typography.Title level={3}>Xodimlar</Typography.Title>
        <div className={cn('staffs__filter')}>
          <Input
            placeholder="Xodimlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('staffs__search')}
          />
          {picker}
          <Button
            onClick={handleAddNewStaff}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Xodim qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        className={resizableTableProps.className}
        columns={columns}
        data={staffsData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
        tableLayout={resizableTableProps.tableLayout}
        components={resizableTableProps.components}
        pagination={{
          total: staffsData?.data?.totalCount,
          current: staffsStore?.pageNumber,
          pageSize: staffsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(staffsData?.data?.totalCount),
        }}
      />

      {staffsStore.isOpenAddEditStaffModal && <AddStaffsModal />}
    </main>
  );
});
