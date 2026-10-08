import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IReminder, IReminderForm, IReminderList, IReminderQuery, IReminderResult} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ReminderApi extends Instance {
  constructor(networkConfig: INetworkConfig) {
    super(networkConfig);
  }

  getMany = (params: IReminderQuery): Promise<IReminderResult<IReminderList>> =>
    this.get(Endpoints.ReminderMany, {params});

  createOne = (body: IReminderForm): Promise<IReminderResult<IReminder>> =>
    this.resPost(Endpoints.ReminderOne, body);

  updateOne = (id: string, body: Partial<IReminderForm>): Promise<IReminderResult<IReminder>> =>
    this.patch(Endpoints.ReminderOne, body, {params: {id}}).then((response) => response.data);

  deleteOne = async (id: string): Promise<IReminderResult<{id: string}>> => {
    const response = await this.delete(Endpoints.ReminderOne, {params: {id}});

    return response.data;
  };
}

export const reminderApi = new ReminderApi(config);
