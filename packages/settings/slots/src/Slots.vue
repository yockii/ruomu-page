<script setup lang="ts">
  import { useCanvasStore, useComponentsStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import SlotInfo from './SlotInfo.vue'
  
  const projectStore = useProjectStore()
  const componentsStore = useComponentsStore()
  const canvasStore = useCanvasStore()
  const {selectState} = storeToRefs(canvasStore)
  const currentSchema = computed(() => projectStore.findSchemaSegment(selectState.value.id))
  const currentComponent = computed(() => componentsStore.findComponentById(currentSchema.value?.componentId))

  const componentSlots = computed(() => currentComponent.value?.metaInfo.slots || [])
</script>

<template>
  <div class="mt-4px">
    <slot-info v-for="slotName in componentSlots" :key="slotName" :slot-name="slotName" :schema="currentSchema"/>
  </div>
</template>

<style scoped>

</style>