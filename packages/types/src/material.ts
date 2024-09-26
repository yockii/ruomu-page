// 说明：MaterialLib是一个UI库定义，每个库包含了一些基本信息，如 code、name、packageName、version、umdJsUrl、umdCssUrl、thumbnailUrl 等。
export type MaterialLib = {
  // 系统生成的唯一ID
  id?: string;
  // 用户自定义的唯一标识
  code: string,
  name: string,
  // npm package name
  packageName: string,
  // 官网
  website?: string;
  description: string;
  // 缩略图地址
  thumbnailUrl: string,
  activeVersionId: string,
  
  activeVersion: MaterialLibVersion
}

export type MaterialLibVersion = {
  id?: string,
  version: string,
  pluginUseName: string,
  cdnJsUrl: string,
  cdnCssUrl: string,
}

export type MaterialComponentGroup = {
  id?: string;
  libCode: string;
  // 组件组名称
  name: string;
  // 组件组描述
  description: string;
}

export type MaterialComponent = {
  id?: string;
  libId?: string;
  libVersionId: string;
  groupId: string;
  // 组件名称
  name: string;
  // 组件描述
  description: string;
  // 组件tag
  tagName: string;
  // 组件截图
  thumbnail?: string;
  // 元信息，如props、events、slots等
  metaInfo: MaterialComponentMetaInfo;
}

export type MaterialComponentMetaInfo = {
  isContainer?: boolean;
  props: PropertyGroup[];
  events: Record<string, Event>;
  slots: string[];
}

export type PropertyGroup = {
  groupName: string;
  collapse?: boolean;
  properties: Property[];
}

export type PropertyWidget = {
  component: 'input' | 'number' | 'color' | 'select' | 'switch' | 'slider' | 'upload' | 'json-editor';
  inline?: boolean, // 是否行内显示
  props: Record<string, any>;
}

export type Property = {
  label: string;
  description: string;
  name: string;
  // [string, number, boolean, object, array]
  type: string;
  required: boolean;
  defaultValue: any;
  widget?: PropertyWidget,
  rules: Record<string, any>;
}

export type Event = {
  label: string;
  name: string;
  description: string;
  params: Parameter[];
  returnValue?: Parameter;
  defaultValue?: string;
}

export type Parameter = {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: any;
}