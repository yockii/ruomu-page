import { MaterialLib, Paginate, Response } from '@ruomu-ui/types'
import { Get, Post } from '../basic/http'

export const MaterialLibApi = {
  list: (params?: Record<string, any>): Promise<Response<Paginate<MaterialLib>>> => {
    return Get<Paginate<MaterialLib>>("/materialLibComponent/list", params);
  },
  instance: (id: string): Promise<Response<MaterialLib>> => {
    return Get<MaterialLib>('/materialLibComponent/instance', {id});
  },
  add: (data: MaterialLib): Promise<Response<MaterialLib>> => {
    return Post<MaterialLib>('/materialLibComponent/add', data);
  },
  update: (data: MaterialLib): Promise<Response<MaterialLib>> => {
    return Post<MaterialLib>('/materialLibComponent/update', data);
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post<Boolean>('/materialLibComponent/delete', {id});
  },
}