<script setup lang="ts">
  import type { PropertyGroup } from "@ruomu-ui/types"
  import {
    useCanvasStore,
    useComponentsStore,
    useProjectStore,
  } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, ref, Ref } from 'vue'
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
    if (currentSchema.value?.componentId) return componentsStore.findComponentById(currentSchema.value?.componentId, currentSchema.value?.libVersionId)
    return null
  })
  type Group = PropertyGroup & {
    expanded: Ref<boolean>;
  }
  const groups = computed<Group[]>(() => {
    const result = []
    if (currentComponent.value) {
      for (const group of currentComponent.value.metaInfo.props) {
        result.push({
          ...group,
          expanded: ref(true)
        })
      }
    }
    return result
  })
  
  const toggleExpanded = (group: Group) => {
    group.expanded.value = !group.expanded.value
  }
</script>

<template>
  <div class="panel">
    <template v-for="group in groups">
      <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="toggleExpanded(group)">
        <span>{{group.groupName}}</span>
        <n-icon size="18">
          <ChevronUp v-if="group.expanded"/>
          <ChevronDown v-else/>
        </n-icon>
      </div>

      <n-collapse-transition :show="group.expanded?.value">
        <template v-for="property in group.properties" :key="property.name">
          <single-property v-if="property.widget" :property="property" :related-props="currentSchema.relatedProps?.[property.name]" />
        </template>
      </n-collapse-transition>
    </template>
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