<script setup lang="ts">
import Layout from './components/Layout.vue'
import Spacing from './components/Spacing.vue'
import Border from './components/border/index.vue'
import { useCanvasStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'


const canvasStore = useCanvasStore()
const {selectState} = storeToRefs(canvasStore)
const canShow = computed(() => {
  return selectState.value?.id
})
</script>

<template>
  <div class="mt-4px" v-if="canShow">
    <!-- TODO 手写行内样式 -->
    <layout />
    
    <Spacing />
    
    <Border />
  </div>
</template>

<style scoped>

</style>