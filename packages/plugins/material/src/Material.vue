<script setup lang="ts">
import { NAutoComplete, NIcon, NH6, NCollapseTransition } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import type { MaterialComponent, MaterialComponentGroup, MaterialLib } from '@ruomu-ui/types'
import { Search, ChevronDown, ChevronUp } from "@vicons/tabler"
import { deepClone, useCanvasStore } from '@ruomu-ui/core'
import { Group, usePluginMaterialStore } from './Store.ts'
import { storeToRefs } from 'pinia'

const canvasStore = useCanvasStore()

const searchKeyword = ref('')
const searchAutocompleteResults = computed(() => {
  const result:{label:string,value:string}[] = [] // label, value
  const filteredComponents = components.value.filter((component) => {
    return component.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  })
  filteredComponents.forEach((component) => {
    result.push({
      label: component.name,
      value: component.name
    })
  })
  return result
})

const groupedAndFilteredComponents = computed(() => {
  const result = [] as (MaterialComponentGroup & {children: MaterialComponent[]})[]
  groups.value.forEach((group) => {
    const children = components.value.filter((component) => {
      return component.groupId === group.id && component.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    })
    if (children.length > 0) {
      result.push({
        ...group,
        children
      })
    }
  })
})

const myStore = usePluginMaterialStore()
const {componentLibs,  currentLib} = storeToRefs(myStore)

const components = computed<MaterialComponent[]>(() => {
  return currentLib.value?.components || []
})
const groups = computed<Group[]>(() => {
  return currentLib.value?.groups || []
})

const dragstart = (component: MaterialComponent) => {
  canvasStore.dragStarted(deepClone(component))
}

onMounted(() => {
  if (componentLibs.value.length === 0) {
    myStore.getLibs()
  }
})

const changeCurrentLib = (lib: MaterialLib) => {
  currentLib.value = lib
  myStore.checkLibGroups()
}
</script>

<template>
  <div class="w-270px relative">
    <div class="absolute -right-80px w-80px">
      <div v-for="lib in componentLibs" :key="lib.id" class="mb-8px b-1px b-#999 b-solid pr-8px cursor-pointer pl-10px" @click="changeCurrentLib(lib)">
        <n-h6 :prefix="(currentLib && currentLib.id === lib.id)?'bar':''" class="m-0" align-text>
          {{ lib.name }}
        </n-h6>
      </div>
    </div>
    <div class="mx-8px mt-8px">
      <n-auto-complete v-model:value="searchKeyword" placeholder="请输入关键字搜索" clearable :options="searchAutocompleteResults">
        <template #suffix>
          <n-icon size="20" class="cursor-pointer">
            <Search />
          </n-icon>
        </template>
      </n-auto-complete>
    </div>
    
    <div class="mt-8px">
      <template v-for="group in groups" :key="group.id">
        <div class="bg-#EFEFEF mt-8px px-8px h-36px flex items-center justify-between cursor-pointer" @click="group.expanded = !group.expanded">
          <span>{{group.name}}</span>
          <n-icon size="18">
            <ChevronUp v-if="group.expanded"/>
            <ChevronDown v-else/>
          </n-icon>
        </div>
  
        <n-collapse-transition :show="!!group.expanded">
          <div class="flex flex-wrap">
            <div v-for="component in group.components" :key="component.id" draggable="true" @dragstart="dragstart(component)" class="bg-#F9F9F9 mt-8px px-8px h-64px w-64px flex flex-col justify-center ml-8px cursor-move">
              <span>{{component.name}}</span>
            </div>
          </div>
        </n-collapse-transition>
      </template>
    </div>
    
    
    
  </div>
</template>

<style scoped>

</style>