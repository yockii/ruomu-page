<script setup lang="ts">
  import type { Property, RelatedProperty } from '@ruomu-ui/types'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { computed, PropType } from 'vue'
  import { NIcon, NTooltip } from 'naive-ui';
  import { CodeFilled } from '@vicons/material'
  import { storeToRefs } from 'pinia'
  import PropertyValue from './PropertyValue.vue'

  const props = defineProps({
    property: {
      type: Object as PropType<Property>,
      required: true
    },
    relatedProp: {
      type: Object as PropType<RelatedProperty>,
      required: false,
    },
  })

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  
  const inline = computed(() => {
    return !!props.property.widget?.inline
  })
  
</script>

<template>
  <div class="flex mt-8px items-center min-h-36px" :class="{'flex-row justify-between': inline, 'flex-col': !inline}">
    <template v-if="inline">
      <div class="property-name">{{ property.label }}</div>
      <div class="flex items-center">
        <div class="mr-8px">
          <property-value :property="property" inline :readonly="relatedProp && relatedProp.varName" />
        </div>
        <div class="property-bind">
        <n-tooltip>
          <template #trigger>
            <n-icon class="cursor-pointer" size="18">
              <CodeFilled />
            </n-icon>
          </template>
          <span>关联变量</span>
        </n-tooltip>
      </div>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-between w-100%">
        <div class="property-name">{{ property.name }}</div>
        <div class="property-bind">
          <n-tooltip>
            <template #trigger>
              <n-icon class="cursor-pointer" size="18">
                <CodeFilled />
              </n-icon>
            </template>
            <span>关联变量</span>
          </n-tooltip>
        </div>
      </div>
      <div class="property-value w-100%">
        <property-value :property="property" />
      </div>
    </template>

  </div>
</template>

<style scoped>

</style>