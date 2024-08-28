import {defineStore} from "pinia";
import type { Project, Page, PageSchema, Schema, MaterialComponent } from '../types'

interface projectState {
  project: Project | undefined,
  pages: Page[],
  currentPageSchema: PageSchema | null
}

function findSchemaSegment(id: string, schema: Schema | null) : Schema | null {
  if (!schema || schema.id === id) {
    return schema
  }
  if (schema.children) {
    for (const child of schema.children) {
      const result = findSchemaSegment(id, child)
      if (result) {
        return result
      }
    }
  }
  return null
}

function findAndRemoveSchemaSegment(id: string, schema: Schema | string | null) {
  if (typeof schema === 'string') {
    return
  }
  if (schema && schema.children) {
    for (let i = 0; i < schema.children.length; i++) {
      const child = schema.children[i]
      if (child.id === id) {
        schema.children.splice(i, 1)
        return
      }
      findAndRemoveSchemaSegment(id, child)
    }
  }
}

function findSchemaSegmentParent(id: string, schema: Schema) : Schema | null {
  if (schema.children) {
    for (const child of schema.children) {
      if (child.id === id) {
        return schema
      }
      const result = findSchemaSegmentParent(id, child)
      if (result) {
        return result
      }
    }
  }
  return null
}

export const useProjectStore = defineStore("project", {
  state: (): projectState => ({
    project: { 
      id: "demo",
      name: "DEMO",
      description: "A demo project",
      homePageId: "",
      status: 1,
      usedMaterialLib: [],
    },
    pages: [],
    currentPageSchema: {
      id: '1',
      state: {},
      fileName: 'index.vue',
      componentId: 'page',
      componentName: 'page',
      tagName: '',
      props: {},
      css: '',
      children: [
        {
          id: '2222',
          componentId: 'builtInComponentDiv',
          componentName: 'div',
          tagName: 'div',
          props: {
            innerHTML: 'Hello World'
          },
        }
      ]
    }
  }),
  getters: {
    styleValue: (state) => (schemaId: string, styleName: string) => {
      const schema = findSchemaSegment(schemaId, state.currentPageSchema)
      if (schema && schema.props && schema.props.style) {
        return schema.props.style[styleName]
      }
      return ''
    }
  },
  actions: {
    findSchemaSegment(id:string) {
      if (this.currentPageSchema && id) {
        // 从children中查找(递归)
        if (this.currentPageSchema.children){
          for (const child of this.currentPageSchema.children) {
            if (child.id === id) {
              return child
            }
            const result = findSchemaSegment(id, child)
            if (result) {
              return result
            }
          }
        }
      }
      return null
    } ,
    moveSchema(schema: Schema, targetSchemaId: string, position: string) {
      if (!schema || !targetSchemaId || !position || !this.currentPageSchema) {
        return
      }
      // 先找到原来的schema并移除
      findAndRemoveSchemaSegment(schema.id, this.currentPageSchema)
      if (position === 'in') {
        if (targetSchemaId === 'BODY') {
          if (this.currentPageSchema.children) {
            this.currentPageSchema.children.push(schema)
          } else {
            this.currentPageSchema.children = [schema]
          }
        } else {
          const targetSchema = findSchemaSegment(targetSchemaId, this.currentPageSchema)
          if (targetSchema) {
            if (targetSchema.children) {
              targetSchema.children.push(schema)
            } else {
              targetSchema.children = [schema]
            }
          }
        }
      } else {
        // 找到目标schema的父级
        const parent = findSchemaSegmentParent(targetSchemaId, this.currentPageSchema)
        if (parent) {
          const index = parent.children ? parent.children.findIndex(child => child.id === targetSchemaId) : -1
          if (index !== -1) {
            if (parent.children) {
              if (position === 'top' || position === 'left' || position === 'before') {
                parent.children.splice(index, 0, schema)
              } else {
                parent.children.splice(index + 1, 0, schema)
              }
            } else {
              parent.children = [schema]
            }
          }
        }
      }
    }  ,
    addComponent(data: MaterialComponent, targetSchemaId: string, position: string) {
      // 生成一个新的schema
      const schema: Schema = {
        id: `${Date.now()}`,
        componentId: data.id!,
        componentName: data.name,
        tagName: data.tagName,
        props: {},
        children: [],
        isContainer: data.metaInfo.isContainer,
      }

      // 如果没有style或者style.padding,则添加默认值
      const defaultStyle = {
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }
      if (!schema.props.style) {
        schema.props.style = defaultStyle
      }
      
      this.moveSchema(schema, targetSchemaId, position)
    },
    parentSchema(schemaId: string) {
      if (this.currentPageSchema) {
        return findSchemaSegmentParent(schemaId, this.currentPageSchema)
      }
      return null
    },
    removeSchema(schemaId: string) {
      if (this.currentPageSchema) {
        findAndRemoveSchemaSegment(schemaId, this.currentPageSchema)
      }
    },
    updateSchemaPropValue(schemaId: string, propName: string, value: any) {
      const schema = this.findSchemaSegment(schemaId)
      if (schema) {
        if (value) {
          schema.props[propName] = value
        } else {
          // 删除属性
          delete schema.props[propName]
        }
      }
    },
    updateSchemaStyleValue(schemaId: string, value: string) {
      const schema = this.findSchemaSegment(schemaId)
      if (schema) {
        schema.style = value
      }
    },
    addSchemaPropStyleValue(schemaId: string, styleName: string, value: string | null) {
      const schema = this.findSchemaSegment(schemaId)
      if (schema) {
        if (schema.props) {
          if (schema.props.style) {
            if (value) {
              schema.props.style[styleName] = value
            } else {
              // 删除属性
              delete schema.props.style[styleName]
            }
          } else {
            if (value) {
              schema.props.style = {
                [styleName]: value,
              }
            }
          }
        } else {
          if (value) {
            schema.props = {
              style: {
                [styleName]: value,
              },
            }
          }
        }
      }
    }
  },
  persistShare: true,
})