<script setup lang="ts">
  import { useCanvasStore, useLayoutStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'
  
  const canvasStore = useCanvasStore()
  const layoutStore = useLayoutStore()
  const {iframeDom} = storeToRefs(canvasStore)
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
  
</script>

<template>
  <div ref="resizeDom" class="iframe-container" :style="sizeStyle" >
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.iframe-container {
  height: 100%;
}
</style>