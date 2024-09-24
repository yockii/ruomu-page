<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import { Variable } from '@ruomu-ui/types'
  import { NTooltip } from 'naive-ui'
  import { deepClone, useProjectStore } from '@ruomu-ui/core'
  import EditVariable from './editVariable.vue'
  import { storeToRefs } from 'pinia'
  
  const props = defineProps({
    variable: {
      type: Object as PropType<Variable>,
      required: true
    }
  })
  
  const projectStore = useProjectStore()
  const {currentPageSchema} = storeToRefs(projectStore)
  
  const editVariable = ref(false)
  const currentState = ref<Variable | null>(null)
  const toggleEdit = () => {
    if( editVariable.value) {
      editVariable.value = false
    } else {
      currentState.value = deepClone(props.variable)
      editVariable.value = true
    }
  }
  const cancel = () => {
    currentState.value = null
    editVariable.value = false
  }
  const update = () => {
    editVariable.value = false
    if (currentPageSchema.value.state) {
      const idx = currentPageSchema.value.state.findIndex((item: Variable) => item.name === props.variable.name)
      if (idx > -1) {
        currentPageSchema.value.state[idx] = currentState.value
      } else {
        currentPageSchema.value.state.push(currentState.value)
      }
    }
    currentState.value = null
    projectStore.pageDirt = true
  }
  const doDel = () => {
    currentState.value = null
    editVariable.value = false
    if (currentPageSchema.value.state) {
      const idx = currentPageSchema.value.state.findIndex((item: Variable) => item.name === props.variable.name)
      if (idx > -1) {
        currentPageSchema.value.state.splice(idx, 1)
        projectStore.pageDirt = true
      }
    }
  }
</script>

<template>
  <div class="mt-8px">
    <n-tooltip placement="right">
      <template #trigger>
        <div class="tag" @click="toggleEdit">{{ variable.name }}</div>
      </template>
      <div>
        <template v-if="variable.type === 'object'">
          <div>{</div>
          <template v-for="prop in variable.props" :key="prop.name">
            <div>{{ prop.name }}: {{ prop.type }}</div>
          </template>
          <div>}</div>
        </template>
        <template v-else-if="variable.type === 'string'">
          <div>{{ variable.type }} : "{{ variable.defaultValue}}"</div>
        </template>
        <template v-else-if="variable.type === 'number' || variable.type === 'boolean'">
          <div>{{ variable.type }} : {{ variable.defaultValue}}</div>
        </template>
        <template v-else-if="variable.type === 'array'">
          <div>{{ variable.type }} : []</div>
        </template>
        <template v-else>
          <div>{{ variable.type }} : {{ variable.defaultValue }}</div>
        </template>
      </div>
    </n-tooltip>
    
    <edit-variable v-if="editVariable && currentState" need-delete :current-state="currentState" @cancel="cancel" @confirm="update" @del="doDel"/>
  </div>
</template>

<style scoped>
.tag {
  margin: 0 8px;
  border-radius: 4px;
  padding: 8px;
  background: #18A0584F;
  color: #666;
  font-size: 16px;
  text-align: center;
  line-height: 1;
  cursor: pointer;
}
</style>