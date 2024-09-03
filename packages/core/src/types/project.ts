import { MaterialLib, Parameter } from './material'

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
  state: Record<string, any>;
  fileName: string;
  css: string;
  js: JsBlock;
}

export type JsBlock = {
  onMounted?: string;
  onUnmounted?: string;
  onUpdated?: string;
  onBeforeMount?: string;
  onBeforeUnmount?: string;
  methods: JsMethod[];
}

export type JsMethod = {
  id?: string;
  name: string;
  description: string;
  code: string;
  params: Parameter[];
}

export type Schema = {
  id: string;
  libVersionId?: string;
  componentId: string;
  componentName: string;
  isContainer?: boolean;
  tagName: string;
  props: Record<string, any>;
  children?: Schema[];
  // 代码编写的style样式
  style?: string;
  // 绑定的事件
  events?: BindEventInfo[]
}

export type BindEventInfo = {
  eventName: string;
  methodId: string;
}