<script setup lang="ts">
  import type { Property } from '@ruomu-ui/types'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { computed, PropType, ref } from 'vue'
  import { NIcon, NTooltip } from 'naive-ui';
  import { CodeFilled, CodeOffFilled } from '@vicons/material'
  import { storeToRefs } from 'pinia'
  import PropertyValue from './PropertyValue.vue'
  import BindDialog from './BindDialog.vue'

  const props = defineProps({
    property: {
      type: Object as PropType<Property>,
      required: true
    },
  })
  
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  const currentSchema = computed(() => projectStore.findSchemaSegment(selectState.value.id))

  const variableBound = computed(() => !!(currentSchema.value.relatedProps?.[props.property.name]))
  
  const inline = computed(() => {
    return !!props.property.widget?.inline
  })
  
  const showBindDialog = ref(false)
  const openRelatePropDialog = () => {
    showBindDialog.value = true 
  }
</script>

<template>
  <div class="flex mt-8px items-center min-h-36px" :class="{'flex-row justify-between': inline, 'flex-col': !inline}">
    <template v-if="inline">
      <div class="property-name">{{ property.label }}</div>
      <div class="flex items-center">
        <div class="mr-8px">
          <property-value :property="property" inline v-show="!variableBound" />
        </div>
        <div class="property-bind">
        <n-tooltip>
          <template #trigger>
            <n-icon class="cursor-pointer" size="18" @click.stop="openRelatePropDialog" :color="variableBound?'#0e7a0d':''">
              <CodeFilled v-if="variableBound" />
              <CodeOffFilled v-else/>
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
              <n-icon class="cursor-pointer" size="18" @click.stop="openRelatePropDialog" :color="variableBound?'#0e7a0d':''">
                <CodeFilled v-if="variableBound" />
                <CodeOffFilled v-else/>
              </n-icon>
            </template>
            <span>关联变量</span>
          </n-tooltip>
        </div>
      </div>
      <div class="property-value w-100%">
        <property-value :property="property" v-show="!variableBound" />
      </div>
    </template>

    <bind-dialog v-if="showBindDialog" v-model:visible="showBindDialog" :property="property"  />
  </div>
</template>

<style scoped>

</style>