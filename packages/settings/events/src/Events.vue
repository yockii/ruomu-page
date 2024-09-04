<script setup lang="ts">
import { NButton, NDropdown } from 'naive-ui'
import { computed, ref } from 'vue'
import type { BindEventInfo, Event } from "@ruomu-ui/types"
import { useCanvasStore, useComponentsStore, useProjectStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import BindDialog from './BindDialog.vue'

const projectStore = useProjectStore()
const componentsStore = useComponentsStore()
const canvasStore = useCanvasStore()
const {selectState} = storeToRefs(canvasStore)
const currentSchema = computed(() => projectStore.findSchemaSegment(selectState.value.id))
const currentComponent = computed(() => componentsStore.findComponentById(currentSchema.value?.componentId))

const bindedEventInfoList = computed(() => currentSchema.value?.events)

const events = computed(() => {
  const componentEvents = currentComponent.value?.metaInfo.events
  // 转为数组
  return Object.values(componentEvents || {}) as Event[]
})

const dropdownOptions = computed(() => {
  return events.value.map(event => {
    // 是否被绑定
    if (bindedEventInfoList.value?.find((item:BindEventInfo) => item.eventName === event.name)) {
      return {
        label: event.label + '(已绑定)',
        key: event.name,
      }
    }
    
    return {
      label: event.label,
      key: event.name
    }
  })
})

const showBindDialog = ref(false)
const currentEvent = ref<Event | undefined>()
const handleSelectEvent = (eventName: string) => {
  const e = events.value.find(e => e.name === eventName)
  if (!e) return
  currentEvent.value = e
  showBindDialog.value = true
}
</script>

<template>
  <div class="panel">
    <div>
      <n-dropdown trigger="click" :options="dropdownOptions" @select="handleSelectEvent" >
        <n-button block >绑定事件</n-button>
      </n-dropdown> 
    </div>
    
    <bind-dialog v-if="showBindDialog" v-model:visible="showBindDialog" :event="currentEvent"/>
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