import { Paginate, MaterialComponentGroup, Response } from '@ruomu-ui/types'
import { Get, Post } from '../basic/http'

export const MaterialComponentGroupApi = {
  add: (data: MaterialComponentGroup): Promise<Response<MaterialComponentGroup>> => {
    return Post('/materialComponentGroup/add', data)
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post('/materialComponentGroup/delete', { id })
  },
  update: (data: MaterialComponentGroup): Promise<Response<MaterialComponentGroup>> => {
    return Post('/materialComponentGroup/update', data)
  },
  instance: (id: string): Promise<Response<MaterialComponentGroup>> => {
    return Get('/materialComponentGroup/instance', { id })
  },
  list: (params?: Record<string, any>): Promise<Response<Paginate<MaterialComponentGroup>>> => {
    return Get('/materialComponentGroup/list', params)
  }
}