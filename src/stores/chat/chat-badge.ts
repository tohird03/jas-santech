import {makeAutoObservable} from 'mobx';
import {io, Socket} from 'socket.io-client';
import {chatApi} from '@/api/chat';
import {IChatInboxItem, IChatMessage} from '@/api/chat/types';
import {umsStages} from '@/api/endpoints';

type BadgeRow = {
  unread: number;
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
      this.markRead(clientId);
    }
  }

  markRead(clientId: string) {
    const previous = this.rows[clientId];

    if (previous?.unread) {
      this.rows = {
        ...this.rows,
        [clientId]: {unread: 0},
      };
    }

    chatApi.markRead(clientId).catch(() => undefined);
  }

  syncInbox(items: IChatInboxItem[]) {
    const next: Record<string, BadgeRow> = {};

    items.forEach((item) => {
      next[item.id] = {
        unread: this.openClientId === item.id ? 0 : (item.unreadCount || 0),
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
    const viewing = this.openClientId === message.clientId;

    if (viewing) {
      this.markRead(message.clientId);

      return;
    }

    if (message.direction !== 'in') {
      return;
    }

    const previous = this.rows[message.clientId]?.unread || 0;

    this.rows = {
      ...this.rows,
      [message.clientId]: {unread: previous + 1},
    };
  }
}

export const chatBadgeStore = new ChatBadgeStore();
