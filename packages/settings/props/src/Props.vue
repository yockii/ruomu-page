<script setup lang="ts">
  import {
    PropertyGroup,
    useCanvasStore,
    useComponentsStore,
    useProjectStore,
  } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import { NCollapseTransition, NIcon } from 'naive-ui'
  import { ChevronDown, ChevronUp } from "@vicons/tabler"
  import SingleProperty from './SingleProperty.vue'

  const componentsStore = useComponentsStore()
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()

  const { selectState } = storeToRefs(canvasStore)
  const currentSchema = computed(() => {
    return projectStore.findSchemaSegment(selectState.value.id)
  })
  const currentComponent = computed(() => {
    if (currentSchema.value?.componentId) return componentsStore.findComponentById(currentSchema.value?.componentId)
    return null
  })
  type Group = PropertyGroup & {
    expanded?: boolean;
  }
  const groups = computed<Group[]>(() => {
    const result = []
    if (currentComponent.value) {
      for (const group of currentComponent.value.metaInfo.props) {
        result.push({
          ...group,
          expanded: true
        })
      }
    }
    return result
  })
</script>

<template>
  <div class="mt-4px">
    <template v-for="group in groups">
      <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="group.expanded = !group.expanded">
        <span>{{group.groupName}}</span>
        <n-icon size="18">
          <ChevronUp v-if="group.expanded"/>
          <ChevronDown v-else/>
        </n-icon>
      </div>

      <n-collapse-transition :show="group.expanded">
          <single-property v-for="property in group.properties" :key="property.name" :property="property" />
      </n-collapse-transition>
    </template>
  </div>
</template>

<style scoped>

</style>