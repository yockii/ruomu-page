import type { MaterialComponent } from '@ruomu-ui/types'

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
              label: 'css类名列表',
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
            },
            {
              label: "文字内容",
              name: "innerHTML",
              description: "没有子组件时可以显示的文字",
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h1',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h2',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h3',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h4',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h5',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'h6',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [{
        groupName: '基础属性',
        collapse: false,
        properties: [
          {
            label: '内容',
            description: 'innerHTML',
            name: 'innerHTML',
            type: 'string',
            defaultValue: 'p',
            required: false,
            widget: {
              component: 'input',
              props: {}
            },
            rules: {}
          }
        ]
      }],
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
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: '表单方法',
              description: 'method',
              name: 'method',
              type: 'string',
              defaultValue: 'post',
              required: false,
              widget: {
                component: 'select',
                props: {
                  options: [
                    {
                      label: 'get',
                      value: 'get'
                    },
                    {
                      label: 'post',
                      value: 'post'
                    }
                  ]
                }
              },
              rules: {}
            },
            {
              label: '表单action',
              description: 'action',
              name: 'action',
              type: 'string',
              defaultValue: '',
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
          ]
        }
      ],
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
              defaultValue: '',
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'type',
              description: 'type',
              name: 'type',
              type: 'string',
              defaultValue: 'text',
              required: false,
              widget: {
                component: 'select',
                props: {
                  options: [
                    {
                      label: 'text',
                      value: 'text'
                    },
                    {
                      label: 'number',
                      value: 'number'
                    },
                    {
                      label: 'password',
                      value: 'password'
                    },
                    {
                      label: 'email',
                      value: 'email'
                    },
                    {
                      label: 'tel',
                      value: 'tel'
                    },
                    {
                      label: 'url',
                      value: 'url'
                    },
                    {
                      label: 'file',
                      value: 'file'
                    },
                    {
                      label: 'color',
                      value: 'color'
                    },
                    {
                      label: 'range',
                      value: 'range'
                    },
                    {
                      label: 'checkbox',
                      value: 'checkbox'
                    },
                    {
                      label: 'radio',
                      value: 'radio'
                    },
                  ]
                }
              }
            },
            {
              label: 'name',
              description: 'name',
              name: 'name',
              type: 'string',
              defaultValue: '',
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'placeholder',
              description: 'placeholder',
              name: 'placeholder',
              type: 'string',
              defaultValue: '',
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'value',
              description: 'value',
              name: 'value',
              type: 'string',
              defaultValue: '',
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
          ]
        },
        {
          groupName: '控制属性',
          collapse: false,
          properties: [
            {
              label: 'disabled',
              description: 'disabled',
              name: 'disabled',
              type: 'boolean',
              defaultValue: false,
              required: false,
              widget: {
                component: 'switch',
                props: {}
              },
              rules: {}
            },
            {
              label: 'readonly',
              description: 'readonly',
              name: 'readonly',
              type: 'boolean',
              defaultValue: false,
              required: false,
              widget: {
                component: 'switch',
                props: {}
              },
              rules: {}
            },
          ]
        },
        {
          groupName: '限制属性',
          collapse: false,
          properties: [
            {
              label: 'maxlength',
              description: 'maxlength',
              name: 'maxlength',
              type: 'number',
              defaultValue: 0,
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'min',
              description: 'min',
              name: 'min',
              type: 'number',
              defaultValue: 0,
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'max',
              description: 'max',
              name: 'max',
              type: 'number',
              defaultValue: 0,
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
            {
              label: 'step',
              description: 'step',
              name: 'step',
              type: 'number',
              defaultValue: 0,
              required: false,
              widget: {
                component: 'input',
                props: {}
              },
              rules: {}
            },
          ]
        }
      ],
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
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: 'id',
              description: '元素的唯一标识符',
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
              description: '类名列表',
              name: 'className',
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
              label: 'border',
              description: '表格边框宽度',
              name: 'border',
              type: 'number',
              required: false,
              defaultValue: 0,
              widget: {
                component: 'number',
                props: { min: 0 }
              },
              rules: { type: 'number', min: 0 }
            }
          ]
        },
        {
          groupName: '布局属性',
          collapse: true,
          properties: [
            {
              label: 'cellPadding',
              description: '单元格内边距',
              name: 'cellPadding',
              type: 'number',
              required: false,
              defaultValue: 0,
              widget: {
                component: 'number',
                props: { min: 0 }
              },
              rules: { type: 'number', min: 0 }
            },
            {
              label: 'cellSpacing',
              description: '单元格间距',
              name: 'cellSpacing',
              type: 'number',
              required: false,
              defaultValue: 0,
              widget: {
                component: 'number',
                props: { min: 0 }
              },
              rules: { type: 'number', min: 0 }
            }
          ]
        }
      ],
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
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: 'src',
              description: '图片地址',
              name: 'src',
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
              label: 'alt',
              description: '图片描述',
              name: 'alt',
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
    id: "builtInComponentA",
    libVersionId: "builtInVersion",
    groupId: "builtInGroupNavigation",
    name: "a",
    description: "a元素",
    tagName: "a",
    thumbnail: "",
    metaInfo: {
      isContainer: true,
      props: [
        {
          groupName: '基础属性',
          collapse: false,
          properties: [
            {
              label: 'href',
              description: '链接地址',
              name: 'href',
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
              label: 'target',
              description:'打开方式',
              name: 'target',
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
  }
]

export default {
  BuiltInLib,
  BuiltInLibVersion,
  BuiltInComponentGroups,
  BuiltInComponents
}