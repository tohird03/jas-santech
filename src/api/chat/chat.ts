import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IApiResult, IChatInboxItem, IChatList, IChatMessage} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ChatApi extends Instance {
  constructor(networkConfig: INetworkConfig) {
    super(networkConfig);
  }

  inbox = (): Promise<IApiResult<IChatInboxItem[]>> => this.get(Endpoints.ChatInbox);

  getMany = (clientId: string, pageSize?: number): Promise<IApiResult<IChatList>> =>
    this.get(Endpoints.ChatMany, {
      params: pageSize
        ? {clientId, pageNumber: 1, pageSize, pagination: true}
        : {clientId, pagination: false},
    });

  sendText = (clientId: string, text: string): Promise<IApiResult<IChatMessage>> =>
    this.resPost(Endpoints.ChatOne, {clientId, text});

  sendFile = (clientId: string, file: File, text?: string): Promise<IApiResult<IChatMessage>> => {
    const body = new FormData();

    body.append('clientId', clientId);
    body.append('file', file);
    if (text) {
      body.append('text', text);
    }

    return this.resPost(Endpoints.ChatFile, body);
  };

  deleteOne = async (id: string): Promise<IApiResult<{id: string, telegramDeleted: boolean}>> => {
    const response = await this.delete(Endpoints.ChatOne, {params: {id}});

    return response.data;
  };
}

export const chatApi = new ChatApi(config);
