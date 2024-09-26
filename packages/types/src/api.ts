import type {Response} from './http'

export type ApiInfo = {
  preAction: string;
  postAction: string;
  apiList: ApiDefinition[];
}

export type ApiDefinition = {
  id?: string;
  name: string;
  label?: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
}