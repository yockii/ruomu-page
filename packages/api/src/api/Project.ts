import { Paginate, Project, Response } from '@ruomu-ui/types'
import { Get, Post, Put } from '../basic/http'

export const ProjectApi = {
  add: (data: Project): Promise<Response<Project>> => {
    return Post('/project/add', data)
  },
  remove: (id: string): Promise<Response<Boolean>> => {
    return Post('/project/delete', { id })
  },
  update: (data: Project): Promise<Response<Project>> => {
    return Put('/project/update', data)
  },
  updateFrontend: (data: Project): Promise<Response<Project>> => {
    return Put('/project/updateFrontend', data)
  },
  instance: (id: string): Promise<Response<Project>> => {
    return Get('/project/instance', { id })
  },
  list: (params?: Record<string, any>): Promise<Response<Paginate<Project>>> => {
    return Get('/project/list', params)
  }
}