<script setup lang="ts">
import { NAutoComplete, NIcon, NH6, NCollapseTransition } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { MaterialComponent, MaterialComponentGroup, MaterialLib } from '@ruomu-ui/core/src/types/material.ts'
import { Search, ChevronDown, ChevronUp } from "@vicons/tabler"
import { deepClone, httpGet, Paginate, useCanvasStore } from '@ruomu-ui/core'
import BuiltIn from './builtInLib.ts'
import { useComponentsStore } from '@ruomu-ui/core/src/store/components.ts'

const canvasStore = useCanvasStore()
const componentsStore = useComponentsStore()

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

type Lib = MaterialLib & {groups?: MaterialComponentGroup[], components?: MaterialComponent[]}
type Group = MaterialComponentGroup & {components?: MaterialComponent[], expanded?: boolean}

const componentLibs = ref<Lib[]>([])
const currentLib = ref<Lib | null>(null)
const components = computed<MaterialComponent[]>(() => {
  return currentLib.value?.components || []
})
const groups = computed<Group[]>(() => {
  return currentLib.value?.groups || []
})

const getLibs = async () => {
  try {
    const resp = await httpGet<Paginate<MaterialLib>>('/api/v1/materialLab/list', {offset: -1, limit: -1})
    if (resp.code === 200) {
      // 加上 BuiltIn.BuiltInLib
      // componentLibs.value = resp.data?.items || []
      componentLibs.value = [BuiltIn.BuiltInLib, ...resp.data?.items || []]
      
      componentsStore.addLibs(componentLibs.value)
      
      if (currentLib.value === null) {
        currentLib.value = componentLibs.value[0]
        checkLibGroups()
      }

    }
  } catch (error) {
    console.error(error)
  }
}

const checkLibGroups = () => {
  if (currentLib.value) {
    if (currentLib.value.groups && currentLib.value.groups.length > 0) {
      checkComponents()
    } else {
      getGroups()
    }
  }
}

const getGroups = async () => {
  if (!currentLib.value) {
    return
  }
  if (currentLib.value.code === "builtIn") {
    currentLib.value.groups = BuiltIn.BuiltInComponentGroups
    checkComponents()
    return
  }
  // TODO get groups from server
}

const checkComponents = () => {
  if (currentLib.value) {
    if (currentLib.value.components && currentLib.value.components.length > 0) {
      return
    } else {
      getComponents()
    }
  }
}

const getComponents = async () => {
  if (!currentLib.value || !currentLib.value.code) {
    return
  }
  const libCode = currentLib.value.code
  if (libCode === "builtIn") {
    currentLib.value.components = BuiltIn.BuiltInComponents
    componentsStore.addComponents(libCode, BuiltIn.BuiltInComponents)
    buildGroupComponents()
    return
  }
  // TODO get components from server
}

const buildGroupComponents = () => {
  if (currentLib.value) {
    if (currentLib.value.groups && currentLib.value.groups.length > 0) {
      currentLib.value.groups.forEach((group) => {
        group.components = currentLib.value?.components?.filter((component) => {
          return component.groupId === group.id
        })
      })
    }
  }
}

const dragstart = (component: MaterialComponent) => {
  canvasStore.dragStarted(deepClone(component))
}

onMounted(() => {
  getLibs()
})
</script>

<template>
  <div class="w-270px relative">
    <div class="absolute -right-80px w-80px">
      <div v-for="lib in componentLibs" :key="lib.id" class="mb-8px b-1px b-#999 b-solid pr-8px cursor-pointer pl-10px" >
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
      <template  v-for="group in groups" :key="group.id">
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