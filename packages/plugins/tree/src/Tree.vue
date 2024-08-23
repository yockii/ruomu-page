<script setup lang="ts">
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import { NTree } from 'naive-ui'
import type {TreeDropInfo, TreeOption} from 'naive-ui'
  import { computed, h } from 'vue'

const projectStore = useProjectStore()
const canvasStore = useCanvasStore()
const {currentPageSchema} = storeToRefs(projectStore)
const {selectState} = storeToRefs(canvasStore)
  
const renderTreeLabel = ({ option }: { option: TreeOption })  => {
  return h('span', {}, option.componentName as string)
}

const selectedKeys = computed(() => {
  if(selectState.value.id) {
    return [selectState.value.id]
  }
  return []
})
  
  const onDrop = (info: TreeDropInfo) => {
    const schema = info.dragNode
    const targetSchema = info.node
    const pos = info.dropPosition
    let position = 'in'
    if (pos === 'before') {
      position = 'top'
    } else if (pos === 'after') {
      position = 'bottom'
    } else if (pos === 'inside') {
      position = 'in'
    }
    projectStore.moveSchema(schema, targetSchema.id, position)
  }
  
  const nodeProps = ({option}: {option: TreeOption}) => {
    return {
      onClick() {
        canvasStore.selectNodeById(option.id)
      }
    }
  }
</script>

<template>
  <div class="w-240px">
    <n-tree
      block-line
      draggable
      show-line
      :data="[currentPageSchema]"
      children-field="children"
      default-expand-all
      key-field="id"
      :render-label="renderTreeLabel"
      :selected-keys="selectedKeys"
      @drop="onDrop"
      :node-props="nodeProps"
      />
  </div>
</template>

<style scoped>

</style>