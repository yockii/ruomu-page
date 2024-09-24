<script setup lang="ts">
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { NButton, NIcon, NDivider, NTabs, NTabPane } from 'naive-ui'
  import { Plus } from '@vicons/tabler'
  import {Variable} from '@ruomu-ui/types'
  import NewVariable from './editStoreVariable.vue'
  import VariableItem from './variableItem.vue'

  const projectStore = useProjectStore()
  const {project} = storeToRefs(projectStore)
  
  const projectVariable = computed(() => {
    return (project.value?.store || []) as Variable[]
  })
  
  const nonePersistentVariables = computed(() => projectVariable.value.filter(item => !item.storage))
  const sessionLevelVariables = computed(() => projectVariable.value.filter(item => item.storage === 'sessionStorage'))
  const localLevelVariables = computed(() => projectVariable.value.filter(item => item.storage === 'localStorage'))
  
  const currentVariable = ref<Variable | null>(null)
  const addState = () => {
    if (currentVariable.value) {
      return
    }
    currentVariable.value = {
      name: '',
      type: 'string',
      defaultValue: '',
      props: []
    }
  }

  const currentTabName = ref('nonePersistent')
  
  const addNewVariable = () => {
    if (!currentVariable.value) {
      return
    }
    projectStore.addNewProjectVariable(currentVariable.value)
    const storeType = currentVariable.value.storage
    currentVariable.value = null
    
    switch (storeType) {
      case 'sessionStorage':
        currentTabName.value = 'sessionLevel'
        break
      case 'localStorage':
        currentTabName.value = 'localLevel'
        break
      default:
        currentTabName.value = 'nonePersistent'
    }
    
    projectStore.projectDirt = true
  }
</script>

<template>
  <div class="w-320px">
    <div>
      <n-button block :focusable="false" @click.stop="addState">
        <template #icon>
          <n-icon>
            <Plus />
          </n-icon>
        </template>
        新增项目级变量
      </n-button>
    </div>
    <new-variable v-if="currentVariable" :current-state="currentVariable" @cancel="currentVariable = null" @confirm="addNewVariable"/>
    <n-divider />
    <n-tabs v-model:value="currentTabName" type="segment" animated>
      <n-tab-pane name="nonePersistent" tab="不持久化">
        <variable-item v-for="state in nonePersistentVariables" :key="state.name" :variable="state" />
      </n-tab-pane>
      <n-tab-pane name="sessionLevel" tab="会话级">
        <variable-item v-for="state in sessionLevelVariables" :key="state.name" :variable="state" />
      </n-tab-pane>
      <n-tab-pane name="localLevel" tab="本地级">
        <variable-item v-for="state in localLevelVariables" :key="state.name" :variable="state" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>