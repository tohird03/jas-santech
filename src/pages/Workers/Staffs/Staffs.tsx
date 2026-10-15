import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {staffsStore} from '@/stores/workers';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddStaffsModal} from './AddStaffsModal';
import {staffsColumns} from './constants';
import styles from './staffs.scss';

const cn = classNames.bind(styles);

export const Staffs = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

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

  return (
    <main>
      <div className={cn('staffs__head')}>
        <Typography.Title level={3}>Xodimlar</Typography.Title>
        <div className={cn('staffs__filter')}>
          <Input
            placeholder="Xodimlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('staffs__search')}
          />
          <Button
            onClick={handleAddNewStaff}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Xodim qoshish
          </Button>
        </div>
      </div>

      <DataTable
        columns={staffsColumns}
        data={staffsData?.data?.data || []}
        loading={loading}
        isMobile={isMobile}
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
