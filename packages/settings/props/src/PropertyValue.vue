<script setup lang="ts">
  import { NColorPicker, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
  import { computed, PropType } from 'vue'
  import type { Property } from '@ruomu-ui/types'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  
  const props = defineProps({
    property: {
      type: Object as PropType<Property>,
      required: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  })
  
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  const currentSchema = computed(() => {
    return projectStore.findSchemaSegment(selectState.value.id)
  })

  const value = computed(() => {
    return currentSchema.value?.props[props.property.name] || ""
  })

  const updateValue = (v: any) => {
    projectStore.updateSchemaPropValue(currentSchema.value.id, props.property.name, v)

    if(props.property?.widget?.component !== 'color' && props.property?.widget?.component !== 'input') {
      setTimeout(() => {
        canvasStore.selectNodeById(selectState.value.id)
      }, 100)
    }
  }
</script>

<template>
  <div>
    <!-- input -->
    <n-input v-if="property.widget?.component === 'input'" :value="value" @update:value="updateValue" clearable/>
    <!-- color -->
    <n-color-picker style="width: 48px;" v-if="property.widget?.component === 'color'" :value="value" @update:value="updateValue" :actions="['clear']"/>
    <!-- select -->
    <n-select v-if="property.widget?.component === 'select'" :value="value" @update:value="updateValue" clearable :options="property.widget?.props.options" />
    <!-- switch -->
    <n-switch v-if="property.widget?.component === 'switch'" :value="value" @update:value="updateValue" />
    <!-- slider -->
    <n-slider v-if="property.widget?.component === 'slider'" :value="value" @update:value="updateValue" show-tooltip />
    <!-- number / function -->
 
  </div>
</template>

<style scoped>

</style>