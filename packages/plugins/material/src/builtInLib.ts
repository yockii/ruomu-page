import { MaterialComponent } from '@ruomu-ui/core'

export const BuiltInLibVersion = {
  id: "builtInVersion",
  version: "0.0.1",
  pluginUseName: "",
  cdnJsUrl: "",
  cdnCssUrl: ""
}

export const BuiltInLib = {
  id: "builtIn",
  code: "builtIn",
  name: "内置库",
  packageName: "",
  description: "内置库-基础html元素",
  activeVersionId: "builtInVersion",
  thumbnailUrl:"",
  activeVersion: BuiltInLibVersion,
}

export const BuiltInComponentGroups = [
  {
    id: "builtInGroupContainer",
    libCode: "builtIn",
    name: "容器",
    description: "容器组件",
  },
  {
    id: "builtInGroupLabel",
    libCode: "builtIn",
    name: "文本",
    description: "文本组件",
  },
  {
    id: "builtInGroupForm",
    libCode: "builtIn",
    name: "表单",
    description: "表单组件",
  },
  {
    id: "builtInGroupData",
    libCode: "builtIn",
    name: "数据",
    description: "数据组件",
  },
  {
    id: "builtInGroupMedia",
    libCode: "builtIn",
    name: "媒体",
    description: "媒体组件",
  },
  {
    id: "builtInGroupNavigation",
    libCode: "builtIn",
    name: "导航",
    description: "导航组件",
  },
  {
    id: "builtInGroupOther",
    libCode: "builtIn",
    name: "其他",
    description: "其他组件",
  }
]

export const BuiltInComponents:MaterialComponent[] = [
  {
    id: "builtInComponentDiv",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupContainer",
    name: "div",
    description: "div元素",
    tagName: "div",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: 'id',
              description: 'id',
              name: 'id',
              type: 'string',
              required: false,
              defaultValue: '',
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'className',
              description: 'class name list',
              name: 'className',
              type: 'string',
              required: false,
              defaultValue: '',
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            }
          ]
        }
      ],
      events: {
        onClick: {
          label: '点击事件',
          name: 'onClick',
          description: '点击事件',
          params: [
            {
              name: 'event',
              description: '事件对象',
              type: 'object',
              defaultValue: '{}'
            }
          ],
          returnValue: undefined,
          defaultValue: 'console.log(event)'
        }
      },
      slots: []
    }
  },
  {
    id: "builtInComponentSpan",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupContainer",
    name: "span",
    description: "span元素",
    tagName: "span",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: '',
              description: 'innerHTML',
              name: 'innerHTML',
              type: 'string',
              required: false,
              defaultValue: 'span',
              rules: {}
            },
            {
              label: 'id',
              description: 'id',
              name: 'id',
              type: 'string',
              required: false,
              defaultValue: '',
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'className',
              description: 'class name list',
              name: 'className',
              type: 'string',
              required: false,
              defaultValue: '',
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            }
          ]
        }
      ],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH1",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h1",
    description: "h1元素",
    tagName: "h1",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH2",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h2",
    description: "h2元素",
    tagName: "h2",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH3",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h3",
    description: "h3元素",
    tagName: "h3",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH4",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h4",
    description: "h4元素",
    tagName: "h4",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH5",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h5",
    description: "h5元素",
    tagName: "h5",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentH6",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "h6",
    description: "h6元素",
    tagName: "h6",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentP",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupLabel",
    name: "p",
    description: "p元素",
    tagName: "p",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentForm",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupForm",
    name: "form",
    description: "form元素",
    tagName: "form",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentInput",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupForm",
    name: "input",
    description: "input元素",
    tagName: "input",
    thumbnail: "",
    metaInfo: {
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentButton",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupForm",
    name: "button",
    description: "button元素",
    tagName: "button",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentTable",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupData",
    name: "table",
    description: "table元素",
    tagName: "table",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentImg",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupMedia",
    name: "img",
    description: "img元素",
    tagName: "img",
    thumbnail: "",
    metaInfo: {
      props: [],
      events: {},
      slots: []
    }
  },
  {
    id: "builtInComponentA",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupNavigation",
    name: "a",
    description: "a元素",
    tagName: "a",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [],
      events: {},
      slots: []
    }
  }
]

export default {
  BuiltInLib,
  BuiltInLibVersion,
  BuiltInComponentGroups,
  BuiltInComponents
}