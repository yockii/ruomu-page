<script setup lang="ts">
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { NTree, NIcon, NPopconfirm } from 'naive-ui'
  import type {TreeDropInfo, TreeOption} from 'naive-ui'
  import { computed, h } from 'vue'
  import { Delete } from "@vicons/carbon"

  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  const {currentPageSchema} = storeToRefs(projectStore)
  const {selectState} = storeToRefs(canvasStore)
  
  const renderTreeLabel = ({ option }: { option: TreeOption })  => {
    return h('span', {}, option.componentName as string)
  }
  
  const renderTreeSuffix = ({ option }: { option: TreeOption })  => {
    // 删除按钮
    return h(NPopconfirm, {
      onPositiveClick: () => {
        projectStore.removeSchema(option.id)
      }
    }, {
      trigger: () => h(NIcon, { size: 18 }, { default: () => h(Delete) }),
      default: () => '确定删除吗？'
    })
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
  <div class="w-320px">
    <n-tree
      block-line
      draggable
      show-line
      :data="[currentPageSchema]"
      children-field="children"
      default-expand-all
      key-field="id"
      :render-label="renderTreeLabel"
      :render-suffix="renderTreeSuffix"
      :selected-keys="selectedKeys"
      @drop="onDrop"
      :node-props="nodeProps"
      />
  </div>
</template>

<style scoped>

</style>