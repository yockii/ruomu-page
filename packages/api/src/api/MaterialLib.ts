import { MaterialLib, Paginate, Response } from '@ruomu-ui/types'
import { Get, Post } from '../basic/http'

export const MaterialLibApi = {
  list: (params?: Record<string, any>): Promise<Response<Paginate<MaterialLib>>> => {
    return Get<Paginate<MaterialLib>>("/materialLib/list", params);
  },
  instance: (id: string): Promise<Response<MaterialLib>> => {
    return Get<MaterialLib>('/materialLib/instance', {id});
  },
  add: (data: MaterialLib): Promise<Response<MaterialLib>> => {
    return Post<MaterialLib>('/materialLib/add', data);
  },
  update: (data: MaterialLib): Promise<Response<MaterialLib>> => {
    return Post<MaterialLib>('/materialLib/update', data);
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post<Boolean>('/materialLib/delete', {id});
  },
}