import { Paginate, MaterialComponent, Response } from '@ruomu-ui/types'
import { Get, Post } from '../basic/http'

export const MaterialComponentApi = {
  add: (data: MaterialComponent): Promise<Response<MaterialComponent>> => {
    return Post('/materialComponent/add', data)
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post('/materialComponent/delete', { id })
  },
  update: (data: MaterialComponent): Promise<Response<MaterialComponent>> => {
    return Post('/materialComponent/update', data)
  },
  instance: (id: string): Promise<Response<MaterialComponent>> => {
    return Get('/materialComponent/instance', { id })
  },
  list: (params?: Record<string, any>): Promise<Response<Paginate<MaterialComponent>>> => {
    return Get('/materialComponent/list', params)
  }
}