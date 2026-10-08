import type { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';

export const uzLocale: Locale = {
  ...enUS,
  locale: 'uz',
  Pagination: {
    ...enUS.Pagination,
    items_per_page: '/ sahifa',
    jump_to: 'O\'tish',
    page: 'Sahifa',
    prev_page: 'Oldingi sahifa',
    next_page: 'Keyingi sahifa',
  },
  Table: {
    ...enUS.Table,
    emptyText: 'Ma\'lumot yo\'q',
  },
  Empty: {
    description: 'Ma\'lumot yo\'q',
  },
  Popconfirm: {
    ...enUS.Popconfirm,
    okText: 'Ha',
    cancelText: 'Yo\'q',
  },
  Modal: {
    okText: 'Tasdiqlash',
    cancelText: 'Bekor qilish',
    justOkText: 'Yopish',
  },
  global: {
    ...enUS.global,
    placeholder: 'Tanlang',
  },
};
