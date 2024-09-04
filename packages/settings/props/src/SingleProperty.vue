<script setup lang="ts">
  import type { Property } from "@ruomu-ui/types"
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { computed, PropType } from 'vue'
  import { NIcon, NTooltip, NInput, NSwitch, NColorPicker, NSlider, NSelect } from 'naive-ui';
  import { CodeFilled } from '@vicons/material'
  import { storeToRefs } from 'pinia'

  const props = defineProps({
    property: {
      type: Object as PropType<Property>,
      required: true
    }
  })

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  const currentSchema = computed(() => {
    return projectStore.findSchemaSegment(selectState.value.id)
  })
  
  const inline = computed(() => {
    return !!props.property.widget.inline
  })
  
  const value = computed(() => {
     return currentSchema.value?.props[props.property.name] || ""
  })

  const updateValue = (v: any) => {
    projectStore.updateSchemaPropValue(currentSchema.value.id, props.property.name, v)
    
    if(props.property?.widget.component !== 'color' || props.property?.widget.component !== 'input') {
      setTimeout(() => {
        canvasStore.selectNodeById(selectState.value.id)
      }, 100)
    }
  }
</script>

<template>
  <div class="flex mt-8px" :class="{'flex-row justify-between': inline, 'flex-col': !inline}">
    <template v-if="inline">
      <div class="property-name">{{ property.name }}</div>
      <div class="property-value">
        <!-- input -->
        <n-input v-if="property.widget.component === 'input'" :value="value" @update:value="updateValue" clearable/>
        <!-- color -->
        <n-color-picker v-if="property.widget.component === 'color'" :value="value" @update:value="updateValue" :actions="['clear']"/>
        <!-- select -->
        <n-select v-if="property.widget.component === 'select'" :value="value" @update:value="updateValue" clearable :options="property.widget.props.options" />
        <!-- switch -->
        <n-switch v-if="property.widget.component === 'switch'" :value="value" @update:value="updateValue" />
        <!-- slider -->
        <n-slider v-if="property.widget.component === 'slider'" :value="value" @update:value="updateValue" show-tooltip />
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
    </template>
    <template v-else>
      <div class="flex justify-between">
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
      <div class="property-value">
        <!-- input -->
        <n-input v-if="property.widget.component === 'input'" :value="value" @update:value="updateValue" clearable/>
        <!-- color -->
        <n-color-picker v-if="property.widget.component === 'color'" :value="value" @update:value="updateValue" :actions="['clear']"/>
        <!-- select -->
        <n-select v-if="property.widget.component === 'select'" :value="value" @update:value="updateValue" clearable :options="property.widget.props.options" />
        <!-- switch -->
        <n-switch v-if="property.widget.component === 'switch'" :value="value" @update:value="updateValue" />
        <!-- slider -->
        <n-slider v-if="property.widget.component === 'slider'" :value="value" @update:value="updateValue" show-tooltip />
      </div>
    </template>

  </div>
</template>

<style scoped>

</style>