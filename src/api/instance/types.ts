export interface INetworkConfig {
  baseURL?: string;
  headers?: any;
  timeout?: number;
  stageUrl?: string;
}
export type TNetworkError = {
  status?: number;
  message: string;
  title: string;
};

export type TMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
