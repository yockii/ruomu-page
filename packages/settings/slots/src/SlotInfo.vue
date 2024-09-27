<script setup lang="ts">
  import { NCheckbox, NCollapseTransition, NIcon } from 'naive-ui'
  import { computed, PropType, ref } from 'vue'
  import type { Schema, SlotInfo } from '@ruomu-ui/types'
  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'

  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  
  const props = defineProps({
    slotInfo: {
      type: Object as PropType<SlotInfo>,
      required: true,
    },
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
  })

  const slotEnabled = computed(() => !!props.schema.slots?.find(s => s.name === props.slotInfo.name))

  const updateSlotEnabled = (enabled: boolean) => {
    if (enabled) {
      if (!props.schema.slots) {
        props.schema.slots = []
      }
      props.schema.slots?.push({ name: props.slotInfo.name })
    } else {
      props.schema.slots = props.schema.slots?.filter(s => s.name !== props.slotInfo.name)
    }
    projectStore.pageDirt = true
  }

  const expanded = ref(false)

  const slotChildren = computed(() => {
    if (slotEnabled.value) {
      const slot = props.schema.slots?.find(s => s.name === props.slotInfo.name)
      if (slot) {
        return slot.children || []
      }
    }
    return []
  })
  
  const ondrop = (e: DragEvent) => {
    e.preventDefault()
    canvasStore.slotDragEnd(props.schema?.id, props.slotInfo)
    projectStore.pageDirt = true
  }
  
  const dragover = ref(false)
 
</script>

<template>
  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between">
    <div>
      <span class="mr-8px">{{ slotInfo.name }}</span>
      <n-checkbox :checked="slotEnabled" @update:checked="updateSlotEnabled" />
    </div>
    <n-icon size="18" class=" cursor-pointer" @click="expanded = !expanded">
      <ChevronUp v-if="expanded" />
      <ChevronDown v-else />
    </n-icon>
  </div>


  <n-collapse-transition :show="expanded && slotEnabled">
    <div class="slot-drop-container" @drop="ondrop" @dragover="dragover = true" @dragleave="dragover = false" :class="{'bg-#18A058': dragover}">
      <template v-if="slotChildren.length === 0">
        <span>请拖拽元素到此</span>
      </template>
      <template v-else>
        <div v-for="child in slotChildren" :key="typeof child === 'string' ? child : child.id" class="slot-item">
          {{typeof child === 'string' ? child : child.componentName}}
        </div>
      </template>
    </div>
  </n-collapse-transition>
</template>

<style scoped>
  .slot-drop-container {
    margin: 8px 0;
    min-height: 40px;
    width: 100%;
    border: 1px dashed #ccc;
    display:  flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .slot-item {
    display: inline-block;
    margin: 4px;
    width: calc(100% - 24px);
    text-align: center;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>