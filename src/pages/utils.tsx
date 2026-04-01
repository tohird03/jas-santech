export const getPaginationParams = (total?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`Total count: ${total} ta`),
  })
  : {};
