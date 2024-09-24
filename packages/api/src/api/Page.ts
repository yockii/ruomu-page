import { Paginate, Page, Response, PageSchema } from '@ruomu-ui/types'
import { Get, Post, Put } from '../basic/http'

export const PageApi = {
  add: (data: Page): Promise<Response<Page>> => {
    return Post('/page/add', data)
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post('/page/delete', { id })
  },
  update: (data: Page): Promise<Response<Page>> => {
    return Put('/page/update', data)
  },
  instance: (id: string): Promise<Response<Page>> => {
    return Get('/page/instance', { id })
  },
  list: (params?: Record<string, any>): Promise<Response<Paginate<Page>>> => {
    return Get('/page/list', params)
  },
  schema: (id: string): Promise<Response<PageSchema>> => {
    return Get('/page/schema', { id })
  }
}