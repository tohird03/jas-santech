import './chat.scss';

import React, {useEffect, useRef, useState} from 'react';
import {CloseOutlined, DeleteOutlined, FileOutlined, FilePdfOutlined, PaperClipOutlined, SendOutlined} from '@ant-design/icons';
import {observer} from 'mobx-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Empty, Input, notification, Popconfirm, Spin, Tag, Typography} from 'antd';
import {AxiosError} from 'axios';
import {io} from 'socket.io-client';
import {useDebounce} from 'usehooks-ts';
import {chatApi, IApiResult, IChatInboxItem, IChatList, IChatMessage} from '@/api/chat';
import {clientsInfoApi} from '@/api/clients';
import {umsStages} from '@/api/endpoints';
import {authStore} from '@/stores/auth';
import {chatBadgeStore} from '@/stores/chat/chat-badge';
import {addNotification} from '@/utils';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {formatPhoneNumber} from '@/utils/phoneFormat';

const showWarning = (result?: {warning?: {is?: boolean, messages?: string[]}}) => {
  if (result?.warning?.is && result.warning.messages?.length) {
    notification.warning({
      message: result.warning.messages.join(', '),
      placement: 'topRight',
    });
  }
};

const fileHref = (fileUrl: string) => fileUrl.startsWith('http') ? fileUrl : `${umsStages.apiUrl}${fileUrl}`;

const TELEGRAM_DELETE_MS = 48 * 60 * 60 * 1000;

const canDeleteMessage = (createdAt: string) => Date.now() - new Date(createdAt).getTime() < TELEGRAM_DELETE_MS;

const isPdfFile = (message: {mimeType?: string | null, fileName?: string | null}) =>
  message.mimeType === 'application/pdf' || Boolean(message.fileName?.toLowerCase().endsWith('.pdf'));

const seenKey = (clientId: string) => `jas-chat-seen:${clientId}`;

const seenAt = (clientId: string) => {
  const value = Number(localStorage.getItem(seenKey(clientId)) || 0);

  return Number.isFinite(value) ? value : 0;
};

const rememberSeen = (clientId: string, at: number) => {
  if (at > seenAt(clientId)) {
    localStorage.setItem(seenKey(clientId), String(at));
  }
};

type ChatListClient = {
  id: string;
  fullname: string;
  phone: string;
  telegram?: {isActive: boolean} | null;
};

const messagePreview = (message: {text?: string | null, kind?: string, fileName?: string | null}) => {
  const text = message.text?.trim();

  if (text) {
    return text;
  }

  if (message.kind === 'photo') {
    return 'Rasm';
  }

  return message.fileName || 'Fayl';
};

type ChatSummary = {
  lastText: string;
  lastAt: number;
  unread: number;
  incoming: number;
};

const toChatClient = (item: {id: string, fullname: string, phone?: string | null, telegram?: {isActive?: boolean} | null}): ChatListClient => ({
  id: item.id,
  fullname: item.fullname,
  phone: item.phone || '',
  telegram: item.telegram ? {isActive: Boolean(item.telegram.isActive)} : null,
});

const loadChatClients = async (search: string) => {
  const result = await clientsInfoApi.getClientsInfo({
    search,
    pagination: false,
  });

  return (result?.data?.data || []).map(toChatClient);
};

const MessageBubble = ({
  message,
  clientName,
  onDelete,
}: {
  message: IChatMessage;
  clientName: string;
  onDelete: (id: string) => void;
}) => {
  const author = message.direction === 'out'
    ? message.staff?.fullname || 'Xodim'
    : message.direction === 'in'
      ? clientName
      : 'Tizim';

  return (
    <div className={`chat-page__bubble chat-page__bubble--${message.direction}`}>
      <div className="chat-page__meta">
        <span className="chat-page__author">{author}</span>
        {message.direction === 'out' && <span className="chat-page__role">sayt</span>}
        <span className="chat-page__time">{getFullDateFormat(message.createdAt)}</span>
        {canDeleteMessage(message.createdAt) && (
          <Popconfirm
            title="Xabarni o'chirish"
            description="Saytdan va telegramdan o'chadi."
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{style: {background: 'red'}}}
            onConfirm={() => onDelete(message.id)}
          >
            <Button
              size="small"
              type="text"
              icon={<DeleteOutlined />}
              className="chat-page__delete"
              aria-label="Xabarni o'chirish"
            />
          </Popconfirm>
        )}
      </div>
      {message.text && <div className="chat-page__text">{message.text}</div>}
      {message.fileUrl && (message.kind === 'photo' || message.mimeType?.startsWith('image/') ? (
        <a className="chat-page__file chat-page__file--photo" href={fileHref(message.fileUrl)} target="_blank" rel="noreferrer">
          <img src={fileHref(message.fileUrl)} alt={message.fileName || 'rasm'} />
        </a>
      ) : (
        <a className="chat-page__file" href={fileHref(message.fileUrl)} target="_blank" rel="noreferrer">
          {isPdfFile(message) ? <FilePdfOutlined /> : <FileOutlined />}
          <span>{message.fileName || 'Fayl'}</span>
        </a>
      ))}
    </div>
  );
};

export const ChatPage = observer(() => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [client, setClient] = useState<ChatListClient | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, ChatSummary | null>>({});
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 400);
  const token = authStore.token?.accessToken;

  const openClientId = useRef<string | undefined>(undefined);
  const knownClients = useRef<ChatListClient[]>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  openClientId.current = client?.id;

  const {data: inboxResult, isLoading: inboxLoading} = useQuery({
    queryKey: ['chatInbox'],
    queryFn: () => chatApi.inbox(),
    retry: false,
    refetchInterval: 5000,
  });
  const inboxItems = inboxResult?.data || [];
  const {data: allClients = [], isLoading: clientsLoading} = useQuery({
    queryKey: ['chatClients', debouncedSearch],
    queryFn: () => loadChatClients(debouncedSearch),
  });

  knownClients.current = allClients;

  const {data: messages = [], isLoading: messagesLoading, error: messagesError} = useQuery({
    queryKey: ['chatMessages', client?.id],
    enabled: Boolean(client?.id),
    queryFn: () => chatApi.getMany(client!.id),
    select: (result) => [...(result?.data?.data || [])].reverse(),
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(`${umsStages.apiUrl}/chat`, {
      auth: {token},
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;
    const seenIds = new Set<string>();

    const putInThread = (message: IChatMessage) => {
      if (openClientId.current !== message.clientId) {
        return;
      }

      queryClient.setQueryData(
        ['chatMessages', message.clientId],
        (current: IApiResult<IChatList> | undefined) => {
          if (!current?.data?.data || current.data.data.some((item) => item.id === message.id)) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              data: [message, ...current.data.data],
              totalCount: current.data.totalCount + 1,
            },
          };
        }
      );
    };

    const putInList = (message: IChatMessage) => {
      if (seenIds.has(message.id)) {
        return;
      }

      seenIds.add(message.id);
      const at = Date.parse(message.createdAt);
      const lastAt = Number.isNaN(at) ? Date.now() : at;
      const viewing = openClientId.current === message.clientId;

      if (viewing) {
        rememberSeen(message.clientId, lastAt);
      }

      setSummaries((current) => {
        const previous = current[message.clientId];
        const incoming = (previous?.incoming || 0) + (message.direction === 'in' ? 1 : 0);

        return {
          ...current,
          [message.clientId]: {
            lastText: messagePreview(message),
            lastAt,
            unread: viewing || message.direction !== 'in' ? (viewing ? 0 : previous?.unread || 0) : (previous?.unread || 0) + 1,
            incoming,
          },
        };
      });
      queryClient.setQueryData(
        ['chatInbox'],
        (current: IApiResult<IChatInboxItem[]> | undefined) => {
          const rows = [...(current?.data || [])];
          const index = rows.findIndex((item) => item.id === message.clientId);
          const lastMessage = {
            text: message.text,
            kind: message.kind,
            fileName: message.fileName,
            direction: message.direction,
            createdAt: message.createdAt,
          };

          if (index >= 0) {
            rows[index] = {
              ...rows[index],
              lastMessage,
            };
          } else {
            const known = knownClients.current.find((item) => item.id === message.clientId);

            if (!known) {
              return current;
            }

            rows.unshift({
              id: known.id,
              fullname: known.fullname,
              phone: known.phone,
              telegram: known.telegram || null,
              incomingCount: message.direction === 'in' ? 1 : 0,
              lastMessage,
            });
          }

          return {
            ...(current || {data: rows}),
            data: rows,
          };
        }
      );
    };

    socket.on('connect', () => {
      if (openClientId.current) {
        socket.emit('join', {clientId: openClientId.current});
      }
    });
    socket.on('inbox', (message: IChatMessage) => {
      putInList(message);
      putInThread(message);
    });
    socket.on('message', putInThread);
    socket.on('message-deleted', (payload: {id: string, clientId?: string}) => {
      const clientId = payload.clientId || openClientId.current;

      if (!clientId) {
        return;
      }

      queryClient.setQueryData(
        ['chatMessages', clientId],
        (current: IApiResult<IChatList> | undefined) => {
          if (!current?.data?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              data: current.data.data.filter((item) => item.id !== payload.id),
            },
          };
        }
      );
    });

    return () => {
      socketRef.current = null;
      socket.disconnect();
    };
  }, [queryClient, token]);

  useEffect(() => {
    if (!client?.id) {
      return;
    }

    socketRef.current?.emit('join', {clientId: client.id});
  }, [client?.id]);

  useEffect(() => {
    const node = threadRef.current;

    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, client?.id]);

  useEffect(() => {
    chatBadgeStore.setOpenClient(client?.id || null);

    return () => chatBadgeStore.setOpenClient(null);
  }, [client?.id]);

  useEffect(() => {
    if (!inboxItems.length) {
      return;
    }

    chatBadgeStore.syncInbox(inboxItems);
    setSummaries((current) => {
      const next = {...current};

      inboxItems.forEach((item) => {
        const at = Date.parse(item.lastMessage.createdAt);
        const lastAt = Number.isNaN(at) ? 0 : at;
        const previous = current[item.id];
        const seen = seenAt(item.id);

        if (previous && previous.lastAt > lastAt) {
          next[item.id] = previous;

          return;
        }

        if (previous && previous.lastAt === lastAt) {
          next[item.id] = {
            ...previous,
            lastText: messagePreview(item.lastMessage),
            unread: seen >= lastAt ? 0 : previous.unread,
            incoming: Math.max(previous.incoming, item.incomingCount),
          };

          return;
        }

        const added = previous ? Math.max(0, item.incomingCount - previous.incoming) : 0;
        let unread = 0;

        if (seen < lastAt) {
          if (!previous) {
            unread = seen > 0 ? Math.max(added, 1) : item.incomingCount;
          } else {
            unread = previous.unread + added;
          }
        }

        next[item.id] = {
          lastText: messagePreview(item.lastMessage),
          lastAt,
          unread,
          incoming: Math.max(item.incomingCount, previous?.incoming || 0),
        };
      });

      return next;
    });
  }, [inboxResult]);

  useEffect(() => {
    if (!client?.id || !messages.length) {
      return;
    }

    const newest = messages[messages.length - 1];
    const at = Date.parse(newest.createdAt);

    rememberSeen(client.id, at);
    setSummaries((current) => {
      const previous = current[client.id];

      if (!previous || (previous.unread === 0 && previous.lastAt >= at)) {
        return current;
      }

      return {
        ...current,
        [client.id]: {
          lastText: messagePreview(newest),
          lastAt: Math.max(previous.lastAt, at),
          unread: 0,
          incoming: previous.incoming,
        },
      };
    });
  }, [client?.id, messages]);

  const refreshMessages = () => {
    queryClient.invalidateQueries({queryKey: ['chatMessages', client?.id]});
  };

  const handleSend = async () => {
    const value = text.trim();

    if (!client?.id || (!value && !file)) {
      return;
    }

    setSending(true);

    try {
      const result = file
        ? await chatApi.sendFile(client.id, file, value || undefined)
        : await chatApi.sendText(client.id, value);

      showWarning(result);
      setText('');
      setFile(null);
      refreshMessages();
    } catch (error) {
      addNotification(error as AxiosError);
    } finally {
      setSending(false);
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];

    event.target.value = '';

    if (!next) {
      return;
    }

    if (next.size > 20 * 1024 * 1024) {
      addNotification('Fayl 20 MB dan katta');

      return;
    }

    setFile(next);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await chatApi.deleteOne(id);

      showWarning(result);
      refreshMessages();
    } catch (error) {
      addNotification(error as AxiosError);
    }
  };

  const needle = debouncedSearch.trim().toLowerCase();
  const chattedIds = new Set(inboxItems.map((item) => item.id));
  const conversations = inboxItems
    .map(toChatClient)
    .filter((item) => !needle || item.fullname.toLowerCase().includes(needle) || item.phone.includes(needle))
    .sort((left, right) => (summaries[right.id]?.lastAt || 0) - (summaries[left.id]?.lastAt || 0));
  const directory = allClients.filter((item) => !chattedIds.has(item.id) && item.telegram?.isActive);
  const listLoading = inboxLoading || clientsLoading;

  const openClient = (item: ChatListClient) => {
    setFile(null);
    setText('');
    setClient(item);
  };

  return (
    <main className="chat-page">
      <div className="chat-page__head">
        <Typography.Title level={3}>Chat</Typography.Title>
      </div>
      <div className="chat-page__body">
        <aside className="chat-page__clients">
          <Input
            className="chat-page__search"
            placeholder="Mijozlarni qidirish"
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="chat-page__client-list">
            {inboxLoading && <Spin style={{margin: 16}} />}
            {!listLoading && conversations.length === 0 && directory.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {conversations.map((item) => {
              const summary = summaries[item.id];

              return (
                <button
                  type="button"
                  key={item.id}
                  className={`chat-page__client${client?.id === item.id ? ' chat-page__client--active' : ''}`}
                  onClick={() => openClient(item)}
                >
                  <span className="chat-page__client-top">
                    <span className="chat-page__person">
                      <span className="chat-page__client-name">{item.fullname}</span>
                      <span className="chat-page__client-phone">+{formatPhoneNumber(item.phone)}</span>
                    </span>
                    {chatBadgeStore.countFor(item.id) > 0 && (
                      <span className="chat-page__badge">{chatBadgeStore.countFor(item.id)}</span>
                    )}
                  </span>
                  {summary?.lastText && (
                    <span className="chat-page__preview">{summary.lastText}</span>
                  )}
                </button>
              );
            })}
            {(clientsLoading || directory.length > 0) && (
              <div className="chat-page__section">Umumiy ro‘yxat</div>
            )}
            {clientsLoading && <Spin style={{margin: 16}} />}
            {directory.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`chat-page__client${client?.id === item.id ? ' chat-page__client--active' : ''}`}
                onClick={() => openClient(item)}
              >
                <span className="chat-page__client-name">{item.fullname}</span>
                <span className="chat-page__client-phone">+{formatPhoneNumber(item.phone)}</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="chat-page__thread-wrap">
          {!client && <div className="chat-page__empty">Mijozni tanlang</div>}
          {client && (
            <>
              <div className="chat-page__thread-head">
                <span className="chat-page__avatar">{(client.fullname || '?').trim().charAt(0).toUpperCase()}</span>
                <span className="chat-page__thread-person">
                  <span className="chat-page__thread-name">{client.fullname}</span>
                  <span className="chat-page__thread-phone">+{formatPhoneNumber(client.phone)}</span>
                </span>
                {client.telegram && !client.telegram.isActive && <Tag>telegram yo&apos;q</Tag>}
                {client.telegram?.isActive && <Tag color="green">telegram</Tag>}
              </div>
              <div className="chat-page__thread" ref={threadRef}>
                {messagesLoading && <Spin />}
                {messagesError && (
                  <div className="chat-page__empty">
                    Chat yuklanmadi. Prod backendda chat yoqilganini tekshiring.
                  </div>
                )}
                {!messagesLoading && !messagesError && messages.length === 0 && (
                  <div className="chat-page__empty">Xabarlar yo&apos;q</div>
                )}
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    clientName={client.fullname}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <div className="chat-page__composer">
                {file && (
                  <div className="chat-page__attach">
                    {isPdfFile({fileName: file.name, mimeType: file.type}) ? <FilePdfOutlined /> : <FileOutlined />}
                    <span>{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} aria-label="Faylni olib tashlash">
                      <CloseOutlined />
                    </button>
                  </div>
                )}
                <div className="chat-page__composer-row">
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={handleFile}
                  />
                  <Button
                    icon={<PaperClipOutlined />}
                    onClick={() => fileRef.current?.click()}
                    disabled={sending}
                  />
                  <Input.TextArea
                    value={text}
                    autoSize={{minRows: 1, maxRows: 4}}
                    placeholder={file ? 'Fayl matni' : 'Xabar'}
                    onChange={(event) => setText(event.target.value)}
                    onPressEnter={(event) => {
                      if (!event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    loading={sending}
                    disabled={!text.trim() && !file}
                    onClick={handleSend}
                  >
                    Yuborish
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
});
