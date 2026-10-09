import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {authStore} from '@/stores/auth';
import {chatBadgeStore} from '@/stores/chat/chat-badge';

export const ChatBadgeBridge = observer(() => {
  const token = authStore.token?.accessToken;

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    chatBadgeStore.start(token);

    return () => chatBadgeStore.stop();
  }, [token]);

  return null;
});
