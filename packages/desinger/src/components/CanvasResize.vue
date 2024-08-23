<script setup lang="ts">
  import { useCanvasStore, useLayoutStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const canvasStore = useCanvasStore()
const layoutStore = useLayoutStore()
  const {iframe} = storeToRefs(canvasStore)
const {width, height, maxWidth, minWidth} = storeToRefs(layoutStore)
const sizeStyle = computed(() => {
  return {
    width: width.value,
    height: height.value,
    maxWidth: maxWidth.value,
    minWidth: minWidth.value
  }
})
const resizeDom = ref<HTMLElement | null>(null)
// const mouseDown = ref(false)

// const onMouseDown = () => {
//     if (iframe.value) {
//       iframe.value.style.pointerEvents = 'none'
//       mouseDown.value = true
//       bindEvents()
//     }
// }
//
// const bindEvents = () => {
//     document.addEventListener('mousemove', onMouseMove, { passive: false })
//     document.addEventListener('mouseup', onMouseUp)
// }
// const onMouseMove = (event: MouseEvent) => {
//     if (mouseDown.value) {
//       event.preventDefault()
//       calculateSize(event)
//     }
// }
// const onMouseUp = () => {
//     if (iframe.value) {
//       iframe.value.style.pointerEvents = 'auto'
//       mouseDown.value = false
//       document.removeEventListener('mousemove', onMouseMove)
//       document.removeEventListener('mouseup', onMouseUp)
//     }
// }
// const calculateSize = ({ movementX }: MouseEvent) => {
//     const newWidth = width.value + movementX * 2
//     width.value = Math.min(Math.max(newWidth, minWidth.value), maxWidth.value)
// }
</script>

<template>
  <div ref="resizeDom" class="h-100%" :style="sizeStyle" >
    <slot></slot>
<!--    <div class="resize-handler" @mousedown.stop="onMouseDown">-->
<!--      <div class="handler right-handler">-->
<!--        <div class="gutter-handler"></div>-->
<!--        <div class="tab-handler"></div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<style lang="less" scoped>
.resize-handler {
  position: relative;

  .handler {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 17;
  
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -3px;
      width: 4px;
      height: 100%;
      background: #18A058;
      display: none;
    }
    
    &:hover::before {
      display: block;
    }
    
    &:hover {
      .tab-handler {
        background: #18A058;

        &::before, &::after {
          background: #FFFFFF;
        }
      }
    }
    
    .gutter-handler {
      position: absolute;
      top: 0;
      left: -3px;
      width: 4px;
      height: 100%;
      cursor: col-resize;
      pointer-events: all;
    }
    
    .tab-handler {
      position: fixed;
      top: 50%;
      height: 40px;
      width: 14px;
      margin-top: -20px;
      background: #18A058;
      cursor: col-resize;
      pointer-events: all;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      
      &::before, &::after {
        content: '';
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 8px;
        width: 1px;
        background: #18A058;
      }
      
      &::before {
        left: 5px;
      }
    }
    
    .right-handler {
      right: -14px;
      width: 14px;
    }
  }
    
}

</style>