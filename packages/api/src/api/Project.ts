import { Paginate, Project, Response } from '@ruomu-ui/types'
import { Post } from '../basic/http'

export const ProjectApi = {
  add: (data: Project): Promise<Response<Project>> => {
    return Post('/project/add', data)
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post('/project/delete', { id })
  },
  update: (data: Project): Promise<Response<Project>> => {
    return Post('/project/update', data)
  },
  instance: (id: string): Promise<Response<Project>> => {
    return Post('/project/instance', { id })
  },
  list: (params?: Record<string, any>): Promise<Response<Paginate<Project>>> => {
    return Post('/project/list', params)
  }
}