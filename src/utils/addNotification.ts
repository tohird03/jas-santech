import {notification} from 'antd';
import {AxiosError} from 'axios';

export const makeErrMsg = (error: AxiosError<any>): string => {
  if (!error.response?.data) {
    return error.message;
  }

  const message = error.response.data?.error?.messages;

  if (!message) {
    return error.message;
  }

  if (message) {
    return message?.join(', ');
  }

  return message.message;
};

export const addNotification = (data: AxiosError<any> | string): void => {
  if (data instanceof AxiosError) {
    notification.error({
      message: makeErrMsg(data),
      placement: 'topRight',
    });

    return;
  }

  notification.success({
    message: data,
    placement: 'topRight',
  });
};
