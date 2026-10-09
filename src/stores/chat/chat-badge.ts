import {makeAutoObservable} from 'mobx';
import {io, Socket} from 'socket.io-client';
import {chatApi} from '@/api/chat';
import {IChatInboxItem, IChatMessage} from '@/api/chat/types';
import {umsStages} from '@/api/endpoints';

type BadgeRow = {
  unread: number;
  incoming: number;
  lastAt: number;
};

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

class ChatBadgeStore {
  rows: Record<string, BadgeRow> = {};

  openClientId: string | null = null;

  private socket: Socket | null = null;

  private seenIds = new Set<string>();

  constructor() {
    makeAutoObservable(this);
  }

  get total() {
    return Object.values(this.rows).reduce((sum, row) => sum + (row.unread || 0), 0);
  }

  countFor(clientId: string) {
    return this.rows[clientId]?.unread || 0;
  }

  setOpenClient(clientId: string | null) {
    this.openClientId = clientId;

    if (clientId) {
      this.markRead(clientId, Date.now());
    }
  }

  markRead(clientId: string, at: number) {
    rememberSeen(clientId, at);
    const previous = this.rows[clientId];

    if (!previous || previous.unread === 0) {
      return;
    }

    this.rows = {
      ...this.rows,
      [clientId]: {...previous, unread: 0},
    };
  }

  syncInbox(items: IChatInboxItem[]) {
    const next = {...this.rows};

    items.forEach((item) => {
      const at = Date.parse(item.lastMessage?.createdAt);
      const lastAt = Number.isNaN(at) ? 0 : at;
      const previous = next[item.id];
      const seen = seenAt(item.id);

      if (previous && previous.lastAt > lastAt) {
        return;
      }

      if (previous && previous.lastAt === lastAt) {
        next[item.id] = {
          ...previous,
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

      if (this.openClientId === item.id) {
        unread = 0;
      }

      next[item.id] = {
        lastAt,
        unread,
        incoming: Math.max(item.incomingCount, previous?.incoming || 0),
      };
    });

    this.rows = next;
  }

  start(token: string) {
    this.stop();
    chatApi.inbox()
      .then((result) => this.syncInbox(result?.data || []))
      .catch(() => undefined);

    const socket = io(`${umsStages.apiUrl}/chat`, {
      auth: {token},
      transports: ['websocket', 'polling'],
    });

    this.socket = socket;
    socket.on('inbox', (message: IChatMessage) => this.onMessage(message));
  }

  stop() {
    this.socket?.disconnect();
    this.socket = null;
    this.seenIds.clear();
  }

  private onMessage(message: IChatMessage) {
    if (!message?.id || this.seenIds.has(message.id)) {
      return;
    }

    this.seenIds.add(message.id);
    const at = Date.parse(message.createdAt);
    const lastAt = Number.isNaN(at) ? Date.now() : at;
    const viewing = this.openClientId === message.clientId;

    if (viewing) {
      rememberSeen(message.clientId, lastAt);
    }

    const previous = this.rows[message.clientId] || {unread: 0, incoming: 0, lastAt: 0};
    const incoming = previous.incoming + (message.direction === 'in' ? 1 : 0);
    const unread = viewing || message.direction !== 'in' ? (viewing ? 0 : previous.unread) : previous.unread + 1;

    this.rows = {
      ...this.rows,
      [message.clientId]: {unread, incoming, lastAt},
    };
  }
}

export const chatBadgeStore = new ChatBadgeStore();
