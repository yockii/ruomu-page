<script setup lang="ts">
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import CanvasAction from './CanvasAction.vue'
  import CanvasResize from './CanvasResize.vue'
  // import CanvasResizeBorder from '@/components/CanvasResizeBorder.vue'
  // import CanvasDivider from '@/components/CanvasDivider.vue'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    runtimeSrc: {
      type: String,
      default: 'canvas.html'
    }
  })
  
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
    const {dragState,hoverState, lineState} = storeToRefs(canvasStore)
    const {currentPageSchema} = storeToRefs(projectStore)
    
  const iframe = ref<HTMLIFrameElement | null>(null)
  
  const canvasSrc = computed(() => props.runtimeSrc)
  
  const iframeReady = () => {
    if (iframe.value) {
      canvasStore.iframeDom = iframe.value
      
      const innerWindow = iframe.value.contentWindow
      const innerDocument = iframe.value.contentDocument
      
      innerWindow?.addEventListener('dragover', (event) => {
        event.preventDefault()
        const {clientX, clientY} = event
        const element = innerDocument?.elementFromPoint(clientX, clientY)
        if (!element) return
        
        let isSlot = false
        let rmNodeEle: HTMLElement | null = null
        // 先判断是否是插槽
        if (element.closest('.rm-slot')) {
          rmNodeEle = element.closest('.rm-slot')
          isSlot = true
        } else {
          rmNodeEle = element.closest('.rm-node')
        }
        
        let childEl 
        const tempLineState = {
          id: "",
          width: 0, height: 0, top: 0, left: 0, position: "in", forbidden: false, slotName: null as string|null
        }
        if (rmNodeEle) {
          let componentId: string | null = null
          let slotName: string | null = null
          if (isSlot) {
            const slotInfo = rmNodeEle.getAttribute('data-component-slot')
            if (slotInfo) {
              const cIdSName = slotInfo.split('.')
              componentId = cIdSName[0]
              slotName = cIdSName[1]
            }
          } else {
            componentId = rmNodeEle.getAttribute('data-component-id')
          }
          
          const schemaSegment = projectStore.findSchemaSegment(componentId!)
          const rect = rmNodeEle.getBoundingClientRect()
          const {top, left, width, height} = rect
          hoverState.value = {
            top,
            left,
            width,
            height,
            componentName: schemaSegment?.componentName,
            configure: null, //TODO
            schema: schemaSegment,
            slotName
          }
  
          childEl = rmNodeEle
          tempLineState.id = componentId!
          tempLineState.width = width
          tempLineState.height = height
          tempLineState.top = top
          tempLineState.left = left
          tempLineState.slotName = slotName
          tempLineState.forbidden = isSlot ? false : (!schemaSegment.isContainer)
          
          if (isSlot) {
            tempLineState.position = "in"
          } else {
            // 检查鼠标位置，判断是在元素上下左右 20px或者1/4 位置来确定插入位置
            const xAbs = Math.min(20, width / 4)
            const yAbs = Math.min(20, height / 4)
            if (clientX - left < xAbs) {
              tempLineState.position = 'left'
            } else if (left + width - clientX < xAbs) {
              tempLineState.position = 'right'
            } else if (clientY - top < yAbs) {
              tempLineState.position = 'top'
            } else if (top + height - clientY < yAbs) {
              tempLineState.position = 'bottom'
            } else if (schemaSegment.isContainer) {
              // TODO 另外要考虑某些容器只允许特殊的物料插入
              tempLineState.position = 'in'
            } else {
              tempLineState.position = 'bottom'
            }
          }
          
        } else if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
          tempLineState.id = "BODY"
          tempLineState.position = "in"
          const children = currentPageSchema.value?.children || []
          if (children.length > 0) {
            // 如果有子节点，则以最后一个为参照物
            const lastSchema = children[children.length - 1]
            if (typeof lastSchema !== 'string') {
              const dataComponentId = lastSchema.id
              // 查找data-component-id为dataComponentId的元素
              childEl = innerDocument?.querySelector(`[data-component-id="${dataComponentId}"]`)
            }
          }
          const {top, left, width, height} = element.getBoundingClientRect()
          tempLineState.width = width
          tempLineState.height = height
          tempLineState.top = top
          tempLineState.left = left
        }
        
        if (childEl) {
          lineState.value = tempLineState
        } else {
          canvasStore.clearLineState()
        }
        
      })
      
      innerWindow?.addEventListener('drop', (event) => {
        event.preventDefault()
        canvasStore.dragEnd()
      })
      
      innerWindow?.addEventListener('mouseover', (event) => {
        event.preventDefault()
        const et = innerDocument?.elementFromPoint(event.clientX, event.clientY)
        if (et) {
          // 先判断是否slot  class="rm-slot"
          let rmNodeEle = et.closest('.rm-slot')
          if (rmNodeEle) {
            const slotInfo = rmNodeEle.getAttribute('data-component-slot')
            if (slotInfo) {
              const cIdSName = slotInfo.split('.')
              canvasStore.hoverNodeById(cIdSName[0], cIdSName[1])
              return
            }
          }
          rmNodeEle = et.closest('.rm-node')
          if (rmNodeEle) {
            const id = rmNodeEle.getAttribute('data-component-id')
            if (id) {
              // 检查父元素有没有存在 data-component-slot
              const inSlotName = rmNodeEle.getAttribute('data-component-in-slot')
              canvasStore.hoverNodeById(id, "", inSlotName)
              return
            }
          }
        }
        canvasStore.clearHoverState()
      })
      
      innerWindow?.addEventListener('mousedown', (event) => {
        const et = innerDocument?.elementFromPoint(event.clientX, event.clientY)
        if (et) {
          const rmNodeEle = et.closest('.rm-node')
          if (rmNodeEle) {
            const id = rmNodeEle.getAttribute('data-component-id')
            if (id) {
              canvasStore.selectNodeById(id)
              return
            }
          }
        }
  
        canvasStore.clearSelectState()
        
      })
    }
  }
  
  window.addEventListener('innerCanvasReady', iframeReady)
  
  onMounted(() => {})
  onUnmounted(() => {
    window.removeEventListener('innerCanvasReady', iframeReady)
  })
</script>

<template>
  <canvas-action />
<!--  <canvas-divider />-->
<!--  <canvas-resize-border />-->
  
  
  <canvas-resize>
    <iframe id="canvas" ref="iframe" :src="canvasSrc" style="border:none;width:100%;height:100%"></iframe>
  </canvas-resize>
  
  <!-- 右键菜单 -->
  
  <!-- 快捷选择物料面板 -->
</template>

<style scoped>

</style>