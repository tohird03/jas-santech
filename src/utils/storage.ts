
export const setStorageItem = (key: string, value: string): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const getStorageItem = (key: string): string =>
  JSON.parse(window.localStorage.getItem(key) || '');
