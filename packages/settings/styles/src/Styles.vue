<script setup lang="ts">
import Layout from './components/Layout.vue'
import Spacing from './components/Spacing.vue'
import Border from './components/border/index.vue'
import { useCanvasStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Size from './components/Size.vue'
import Text from './components/Text.vue'
import Effect from './components/Effect.vue'
import ManualCode from './components/ManualCode.vue'

const canvasStore = useCanvasStore()
const {selectState} = storeToRefs(canvasStore)
const canShow = computed(() => {
  return selectState.value?.id
})
</script>

<template>
  <div class="panel" v-if="canShow">
    <!-- TODO 手写行内样式 -->
    <manual-code />
      
    <layout />
    
    <Spacing />
    
    <Border />
    
    <Size />
    
    <Text />
    
    <Effect />
  </div>
</template>

<style scoped>
.panel {
  margin-top: 4px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #18A058 #f0f0f0;
}
</style>