import { MaterialLib } from './material'

export type Project = {
  id: string; // id
  name: string; // 应用名称
  description: string; // 描述
  homePageId: string; // 首页页面ID
  status: number; // 状态
  
  usedMaterialLib: MaterialLib[];
}

export type Page = {
  id: string;
  projectId: string;
  name: string;
  parentId?: string;
  route: string;
  
}

export type PageSchema = Schema & {
  // id?: string;
  state: Record<string, any>;
  fileName: string;
  // Page
  // componentName: string;
  css: string;
  // props: any;
  // children: Schema[];
}

export type Schema = {
  id: string;
  libId?: string;
  componentId: string;
  componentName: string;
  isContainer?: boolean;
  tagName: string;
  props: Record<string, any>;
  children?: Schema[];
}