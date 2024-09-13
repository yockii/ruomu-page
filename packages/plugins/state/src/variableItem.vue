<script setup lang="ts">
import { PropType } from 'vue'
import { Variable } from '@ruomu-ui/types'
import { NTooltip } from 'naive-ui'
defineProps({
  variable: {
    type: Object as PropType<Variable>,
    required: true
  }
})
</script>

<template>
  <div class="mt-8px">
    <n-tooltip placement="right">
      <template #trigger>
        <div class="tag">{{ variable.name }}</div>
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