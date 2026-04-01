import React from 'react';
import {
  Card,
  Divider,
  Empty,
  Pagination,
  PaginationProps,
  Skeleton,
  Table,
} from 'antd';
import {ColumnType} from 'antd/es/table';
import styles from './datatable.module.css';

export interface DataTableColumnsType<T> extends ColumnType<T> {
  colStyle?: (value: any, record: T, index: number) => Object;
}

type DataTableProps = {
  rowKey?: string;
  loadingLength?: number;
  scroll?: {
    y?: number;
    x?: number;
  };
  isMobile?: boolean;
  columns: any[];
  data: any[];
  className?: string;
  rowClassName?: any;
  loading?: boolean;
  cardStyle?: Object;
  cardTextStyle?: Object;
  pagination?:
  | {
    pageSize?: number;
    current?: number;
    total?: number;
    onChange?: (page: number, pageSize?: number) => void;
    showSizeChanger?: boolean;
  }
  | false;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => void;
  };
};

export const DataTable = (props: DataTableProps) => {
  const {
    isMobile = false,
    columns,
    data = [],
    className,
    loading = false,
    rowClassName,
    pagination,
    rowSelection,
    rowKey = '',
    loadingLength,
    scroll,
    cardStyle,
    cardTextStyle,
  } = props;

  const onChange: PaginationProps['onChange'] = (page, pageSize) => {
    if (pagination) {
      pagination?.onChange?.(page, pageSize);
    }
  };

  return !isMobile ? (
    <Table
      pagination={{
        ...pagination,
        pageSizeOptions: [20, 50, 100, 500, 1000],
      }}
      loading={loading}
      columns={columns}
      dataSource={data}
      bordered
      rowClassName={rowClassName}
      rowSelection={rowSelection}
      rowKey={rowKey}
      scroll={scroll}
    />
  ) : loading ? (
    <div className={styles.loading__container}>
      {[...new Array(loadingLength ?? 4)].map((item: any, index: number) => (
        <Skeleton
          paragraph={{rows: 7}}
          className={styles.loading__skeleton}
          key={index}
          active
        />
      ))}
    </div>
  ) : data.length === 0 ? (
    <Empty />
  ) : (
    <div className={`${styles.card_wrapper} ${className}`}>
      {data?.map((d, index) => (
        <Card
          bodyStyle={{padding: '12px'}}
          key={d?.id}
          className={`${styles.card} ${rowClassName?.(d)}`}
          style={cardStyle}
        >
          {columns.map((c, cIndex) => {
            const isLast = cIndex === columns.length - 1;

            return (
              <React.Fragment key={c.key}>
                <div
                  style={c?.colStyle ? c.colStyle(d[c.dataIndex], d, index) : {}}
                  className={styles.paragraph}
                >
                  <span
                    style={{
                      ...cardTextStyle,
                      ...(c?.colStyle ? c.colStyle(d[c.dataIndex], d, index)?.textStyle : {}),
                    }}
                    className={styles.head}
                  >
                    {c.title}
                  </span>

                  {c.render ? (
                    <span
                      style={{
                        ...cardTextStyle,
                        ...(c?.colStyle ? c.colStyle(d[c.dataIndex], d, index)?.textStyle : {}),
                      }}
                      className={styles.title}
                    >
                      {c.render(d[c.dataIndex], d, index)}
                    </span>
                  ) : (
                    <span style={cardTextStyle} className={styles.title}>
                      {d[c.dataIndex]}
                    </span>
                  )}
                </div>
                {isLast ? null : (
                  <Divider key={c.key} className={styles.line} />
                )}
              </React.Fragment>
            );
          })}
        </Card>
      ))}
      <div className={styles.pagination}>
        {pagination && (
          <Pagination
            onChange={onChange}
            current={pagination?.current}
            total={pagination?.total}
            showSizeChanger
            pageSize={pagination?.pageSize}
            size="small"
            pageSizeOptions={[20, 50, 100, 500, 1000]}
          />
        )}
      </div>
    </div>
  );
};
