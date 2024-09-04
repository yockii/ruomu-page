import { defineStore } from 'pinia'
import { MaterialComponent, MaterialComponentMetaInfo, Node, Schema } from '../types'
import { useProjectStore } from './project'
import { useLayoutStore } from './layout'

type RectState = {
  id?: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  componentName?: string;
  configure?: MaterialComponentMetaInfo | null;
  schema?: Schema | null;
}

type LineState = {
  // 组件的id, 用于标识组件，在组件的上下左右或内部等位置显示
  id?: string;
  // 插槽名称，用于标识插槽
  slotName?: string;
  config?: any;
  doc?: any;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  position?: string;
  forbidden?: boolean;
}

interface CanvasState {
  iframe: HTMLIFrameElement | null
  dragState: {
    data?: MaterialComponent | null;
    schema?: Schema | null;
  },
  // 鼠标悬浮状态的矩形框
  hoverState: RectState & {slotName?: string},
  // 选中的节点
  selectState: RectState,
  // 节点的拖拽状态
  lineState: LineState,
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    iframe: null,
    dragState: {},
    hoverState: {},
    selectState: {},
    lineState: {}
  }),
  getters: {
    selectNodePathArray(): Node[] {
      // 选中的节点的路径
      const result: Node[] = []
      const current = this.selectState.schema
      if (!current) return result
      result.unshift({
        id: current?.id,
        name: current?.componentName
      })
      const projectStore = useProjectStore()
      let parent = projectStore.parentSchema(current?.id!)
      while (parent) {
        result.unshift({
          id: parent.id,
          name: parent.componentName
        })
        parent = projectStore.parentSchema(parent.id)
      }
      return result
    }
  },
  actions: {
    selectNodeById(id: string) {
      if (!id || !this.iframe) return
      const doc = this.iframe.contentDocument
      if (!doc) return
      const schemaSegment = useProjectStore().findSchemaSegment(id)
      if (!schemaSegment) return
      const dataComponentId = schemaSegment?.id
      // data-component-id
      const element = doc.querySelector(`[data-component-id="${dataComponentId}"]`)
      if (!element) return
      const rect = element.getBoundingClientRect()
      this.selectState = {
        id,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        componentName: schemaSegment.componentName,
        configure: null, // TODO
        schema: schemaSegment
      }
      this.clearHoverState()
      useLayoutStore().showSettingsPanel = true
    },
    hoverNodeById(id: string, slotName: string = '') {
      if (!id || !this.iframe || (id === this.selectState?.id)) return
      const doc = this.iframe.contentDocument
      if (!doc) return
      const schemaSegment = useProjectStore().findSchemaSegment(id)
      if (!schemaSegment) return
      const dataComponentId = schemaSegment?.id
      
      let element: HTMLElement|null = null
      if (slotName) {
        element = doc.querySelector(`[data-component-slot="${dataComponentId}.${slotName}"]`)
      }  else {
        element = doc.querySelector(`[data-component-id="${dataComponentId}"]`)
      }
      if (!element) return
      const rect = element.getBoundingClientRect()
      this.hoverState = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        componentName: schemaSegment.componentName + (slotName ? `#${slotName}` : ''),
        configure: null, // TODO
        schema: schemaSegment,
        slotName: slotName,
      }
    },
    
    clearSelectState() {
      this.selectState = {
        id: '',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        componentName: '',
        configure: null,
        schema: null
      }
    },

    clearHoverState() {
      this.hoverState = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        componentName: '',
        configure: null,
        schema: null
      }  
    },
    
    clearLineState() {
      this.lineState = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        position: '',
        forbidden: false,
        config: null,
        doc: null
      }
    },
    
    clearDragState () {
      this.dragState = {
        data: null,
        schema: null
      }
    },
    dragStarted(component: MaterialComponent, schema:Schema|undefined = undefined) {
      this.dragState = {
        data: component,
        schema,
      }
     
      this.clearHoverState()
    },
    
    dragEnd() {
      const {data, schema} = this.dragState
      const {position, forbidden, id, slotName} = this.lineState
      if (!forbidden && id && position) {
        // 给schema默认值
        if (schema) {
          data?.metaInfo.props.forEach(group => {
            group.properties.forEach(prop => {
              if (prop.defaultValue) {
                schema.props[prop.name] = prop.defaultValue
              }
            })
          })
        }
        
        if (schema) {
          // 有schema,则是拖拽已有的组件
          useProjectStore().moveSchema(schema, id, position, slotName)
        } else {
          // 新的组件
          useProjectStore().addComponent(data!, id, position, slotName)
        }
      }
      this.clearDragState()
      this.clearLineState()
    }
  },
  persistShare: true,
})