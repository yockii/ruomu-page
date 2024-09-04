<script setup lang="ts">
  import { useCanvasStore, useLayoutStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import CanvasContainer from './CanvasContainer.vue'
  import FooterBar from './CanvasFooterBar.vue'

const layoutStore = useLayoutStore()
const {scale, width} = storeToRefs(layoutStore)

const canvasStore = useCanvasStore()

const canvasStyle = computed(() => {
  return {
    height: `calc((100% - 66px) * ${scale.value})`,
    width: `calc((${width.value}px) * ${scale.value})`,
    transform: `scale(${scale.value})`
  }
})

window.addEventListener('dragover', (event) => {
  event.preventDefault()
  canvasStore.clearLineState()
})

</script>

<template>
  <div class="bg-#e5e5e5 w-100% h-100% flex justify-center relative">
    <div class="bg-#FFF absolute my-18px transform-origin-top" :style="canvasStyle">
      <canvas-container />
    </div>
    <footer-bar />
  </div>
</template>

<style scoped>

</style>