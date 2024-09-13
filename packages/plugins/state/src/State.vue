<script setup lang="ts">
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { NButton, NIcon, NDivider } from 'naive-ui'
  import { Plus } from '@vicons/tabler'
  import {Variable} from '@ruomu-ui/types'
  import NewVariable from './newVariable.vue'
  import VariableItem from './variableItem.vue'

  const projectStore = useProjectStore()
  const {currentPageSchema} = storeToRefs(projectStore)
  
  const pageState = computed(() => {
    return (currentPageSchema.value?.state || []) as Variable[]
  })
  
  const currentState = ref<Variable | null>(null)
  const addState = () => {
    if (currentState.value) {
      return
    }
    currentState.value = {
      name: '',
      type: 'string',
      defaultValue: '',
      props: []
    }
  }
  const addNewState = () => {
    if (!currentState.value) {
      return
    }
    projectStore.addNewState(currentState.value)
    currentState.value = null
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
        新增数据变量
      </n-button>
    </div>
    <new-variable v-if="currentState" :current-state="currentState" @cancel="currentState = null" @confirm="addNewState"/>
    <n-divider />
    <variable-item v-for="state in pageState" :key="state.name" :variable="state" />
  </div>
</template>

<style scoped>

</style>