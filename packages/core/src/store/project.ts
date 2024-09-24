import {defineStore} from "pinia";
import type { JsMethod, Project, Page, PageSchema, Schema, MaterialComponent, Variable } from '@ruomu-ui/types'
import { PageApi, ProjectApi } from '@ruomu-ui/api'

interface projectState {
  project: Project | undefined,
  pages: Page[],
  currentPageSchema: PageSchema | null,
  projectDirt: boolean,
  pageDirt: boolean,
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
  // slot 中也要查找
  if (schema.slots) {
    for (const slot of schema.slots) {
      const slotChildren = slot.children
      if (slotChildren && typeof slotChildren !== 'string' && slotChildren.length > 0) {
        for (const slotChild of slotChildren) {
          const result = findSchemaSegment(id, slotChild)
          if (result) {
            return result
          }
        }
      } 
    }
  } 
  return null
}

function findAndRemoveSchemaSegment(id: string, schema: Schema | string | null) {
  if (typeof schema === 'string') {
    return
  }
  if (schema) {
    if (schema.children) {
      for (let i = 0; i < schema.children.length; i++) {
        const child = schema.children[i]
        if (child.id === id) {
          schema.children.splice(i, 1)
          return
        }
        findAndRemoveSchemaSegment(id, child)
      }
    }
    if (schema.slots) {
      for (const slot of schema.slots) {
        const slotChildren = slot.children
        if (slotChildren && typeof slotChildren !== 'string' && slotChildren.length > 0) {
          for (const slotChild of slotChildren) {
            if (slotChild.id === id) {
              slotChildren.splice(slotChildren.indexOf(slotChild), 1)
              return
            }
            findAndRemoveSchemaSegment(id, slotChild)
          }
        } 
     }
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
  // slots
  if (schema.slots) {
    for (const slot of schema.slots) {
      const slotChildren = slot.children
      if (slotChildren && typeof slotChildren !== 'string' && slotChildren.length > 0) {
        for (const slotChild of slotChildren) {
          if (slotChild.id === id) {
            return schema
          }
          const result = findSchemaSegmentParent(id, slotChild)
          if (result) {
            return result
          }
        }
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
      store: []
    },
    pages: [],
    currentPageSchema: {
      id: '1',
      state: [],
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
      ],
      js: {
        methods: []
      }
    },
    projectDirt: false,
    pageDirt: false,
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
    async saveProject() {
      if (this.project) {
        try {
          const response = await ProjectApi.updateFrontend(this.project)
          if (response.code === 0) {
            this.projectDirt = false
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    async savePage() {
      if (this.currentPageSchema) {
        try {
          const response = await PageApi.update({ id: this.currentPageSchema.id, schema: this.currentPageSchema })
          if (response.code === 0) {
            this.pageDirt = false
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    save() {
      if (this.projectDirt) {
        this.saveProject()
      }
      if (this.pageDirt) {
        this.savePage()
      }
    },
    async initProject() {
      if (!this.project?.id) {return}
      try {
        const response = await PageApi.list({
          projectId: this.project.id, offset:-1,limit:-1,
        })
        if (response.code === 0 && response.data) {
          this.pages = response.data.items || []
          if (this.pages.length > 0) {
            if (this.project.homePageId) {
              const homePage = this.pages.find(p => p.id === this.project!.homePageId)
              if (homePage && homePage.id) {
                this.getPageSchema(homePage.id)
                return
              }
            }
            if (this.pages[0].id) {
              this.getPageSchema(this.pages[0].id)
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getPageSchema(pageId: string) {
      const page = this.pages.find(p => p.id === pageId)
      if (!page) return
      if (page.schema) {
        this.currentPageSchema = page.schema
        return
      }
      
      try {
        const response = await PageApi.schema(pageId)
        if (response.code === 0 && response.data) {
          page.schema = response.data
          this.currentPageSchema = response.data
          this.currentPageSchema.id = pageId
        }
      } catch (e) {
        console.error(e)
      }
    },
    addNewProjectVariable(v:Variable) {
      if (!v || !this.project) return
      if (!this.project.store || !this.project.store.length) {
        this.project.store = [v]
      } else {
        // 如果name相同，则替换
        const index = this.project.store.findIndex(s => s.name === v.name)
        if (index !== -1) {
          this.project.store[index] = v
        } else {
          this.project.store.push(v)
        }
      }
    },
    addNewState(v:Variable) {
      if (!v || !this.currentPageSchema) return
      if (!this.currentPageSchema.state || !this.currentPageSchema.state.length) {
        this.currentPageSchema.state = [v]
      } else {
        // 如果name相同，则替换
        const index = this.currentPageSchema.state.findIndex(s => s.name === v.name)
        if (index !== -1) {
          this.currentPageSchema.state[index] = v
        } else {
          this.currentPageSchema.state.push(v)
        }
      } 
    },
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
    moveSchema(schema: Schema, targetSchemaId: string, position: string, slotName: string | undefined) {
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
            if (slotName) {
              if (targetSchema.slots) {
                // 检查，如果有则替换
                const slot = targetSchema.slots.find(s => s.name === slotName)
                if (slot) {
                  // 替换
                  slot.children = [schema]
                } else {
                  // 添加
                  targetSchema.slots.push({
                    name: slotName,
                    children: [schema]
                  })
                }
              } else {
                targetSchema.slots = [{
                  name: slotName,
                  children: [schema]
                }]
              }
            } else {
              if (targetSchema.children) {
                targetSchema.children.push(schema)
              } else {
                targetSchema.children = [schema]
              }
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
    addComponent(data: MaterialComponent, targetSchemaId: string, position: string, slotName: string | undefined) {
      // 生成一个新的schema
      const schema: Schema = {
        id: `${Date.now()}`,
        componentId: data.id!,
        libVersionId: data.libVersionId,
        componentName: data.name,
        tagName: data.tagName,
        props: {},
        children: [],
        isContainer: data.metaInfo.isContainer,
      }
      
      // props给默认值
      data?.metaInfo.props.forEach(group => {
        group.properties.forEach(prop => {
          if (prop.defaultValue) {
            schema.props[prop.name] = prop.defaultValue
          }
        })
      })

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
      
      this.moveSchema(schema, targetSchemaId, position, slotName)
    },
    addNewCustomMethod(m: JsMethod) {
      if (this.currentPageSchema?.js) {
        if (this.currentPageSchema.js.methods) {
          this.currentPageSchema.js.methods.push(m)
        } else {
          this.currentPageSchema.js.methods = [m]
        }
      } else if (this.currentPageSchema) {
        this.currentPageSchema.js = {
          methods: [m]
        }
      }
    },
    removeCustomMethod(methodId: string) {
      if (this.currentPageSchema?.js?.methods) {
        this.currentPageSchema.js.methods = this.currentPageSchema.js.methods.filter(m => m.id !== methodId)
        this.removeSchemaMethod(methodId, this.currentPageSchema)
      }
    },
    removeSchemaMethod(methodId: string, schema: Schema) {
      if (schema.events) {
        schema.events = schema.events.filter(event => event.methodId !== methodId)
      }
      if (schema.children) {
        schema.children.forEach((child) => {
          this.removeSchemaMethod(methodId, child)
        })
      }
      if (schema.slots) {
        schema.slots.forEach(slot => {
          if (slot.children) {
            if (typeof slot.children === 'string') return
            slot.children.forEach((child) => {
              this.removeSchemaMethod(methodId, child)
            })
          }
        })
      }
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