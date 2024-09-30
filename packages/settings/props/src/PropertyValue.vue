<script setup lang="ts">
  import { NColorPicker, NInput, NSelect, NSlider, NSwitch, NInputNumber } from 'naive-ui'
  import { computed, PropType } from 'vue'
  import type { Property } from '@ruomu-ui/types'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const props = defineProps({
    property: {
      type: Object as PropType<Property>,
      required: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  })

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const { selectState } = storeToRefs(canvasStore)
  const currentSchema = computed(() => {
    return projectStore.findSchemaSegment(selectState.value.id)
  })

  const value = computed(() => {
    return currentSchema.value?.props[props.property.name] || ''
  })

  const updateValue = (v: any) => {
    projectStore.updateSchemaPropValue(currentSchema.value.id, props.property.name, v)
    projectStore.pageDirt = true
    

    if (props.property?.widget?.component !== 'color' && props.property?.widget?.component !== 'input') {
      setTimeout(() => {
        canvasStore.selectNodeById(selectState.value.id)
      }, 100)
    }
  }
</script>

<template>
  <div>
    <!-- input -->
    <n-input v-if="property.widget?.component === 'input'" :value="value" @update:value="updateValue" clearable />
    <!-- color -->
    <n-color-picker style="width: 48px;" v-if="property.widget?.component === 'color'" :value="value"
                    @update:value="updateValue" :actions="['clear']" />
    <!-- select -->
    <n-select v-if="property.widget?.component === 'select'" :value="value" @update:value="updateValue" clearable
              style="min-width: 80px;"
              :options="property.widget?.props?.options" />
    <!-- switch -->
    <n-switch v-if="property.widget?.component === 'switch'" :value="value" @update:value="updateValue" />
    <!-- slider -->
    <n-slider v-if="property.widget?.component === 'slider'" :value="value" @update:value="updateValue" show-tooltip />
    <!-- number -->
    <n-input-number v-if="property.widget?.component === 'number'" :value="value" @update:value="updateValue" clearable />
    <!-- function (提示使用绑定) -->
    <div v-if="property.widget?.component === 'function'" class="text-red-500 text-12px">请绑定函数</div>
  </div>
</template>

<style scoped>

</style>