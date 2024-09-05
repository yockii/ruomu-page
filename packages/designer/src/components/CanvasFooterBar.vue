<script setup lang="ts">
  import { useCanvasStore } from '@ruomu-ui/core'
  import {NBreadcrumb, NBreadcrumbItem} from 'naive-ui'
  import { storeToRefs } from 'pinia'

const canvasStore = useCanvasStore()
const { selectNodePathArray } = storeToRefs(canvasStore)

const selectNode = (id: string) => {
  canvasStore.selectNodeById(id)
}
</script>

<template>
  <div class="h-30px absolute bottom-0 left-0 right-0 bg-#FFF b-t-1px b-t-solid b-#999 z-90 flex items-center px-8px">
    <n-breadcrumb separator=">" v-if="selectNodePathArray.length > 0">
      <n-breadcrumb-item v-for="node in selectNodePathArray" :key="node.id" @click="selectNode(node.id)">
        {{ node.name }}
      </n-breadcrumb-item>
    </n-breadcrumb>
    <div v-else>没有选中的节点</div>
  </div>
</template>

<style scoped>

</style>