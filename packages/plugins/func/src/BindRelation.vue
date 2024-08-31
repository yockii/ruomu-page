<script setup lang="ts">
  import { NModal, NButton, NIcon, NTooltip } from 'naive-ui'

  import { computed } from 'vue'
  import { Schema, useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    methodId: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:visible'])
  const visible = computed({
    get: () => props.visible,
    set: (v) => emit('update:visible', v)
  })
  
  const projectStore = useProjectStore()
  const {currentPageSchema} = storeToRefs(projectStore)
  
  const findRelatedSchemas = (schemas: Schema[]) => {
    const result: Schema[] = []
    schemas.forEach((schema) => {
      if (schema.events) {
        schema.events.forEach((event) => {
          if (event.methodId === props.methodId) {
            result.push(schema)
          }
        })
      }
      if (schema.children) {
        result.push(...findRelatedSchemas(schema.children))
      }
    })
    return result
  }
  
  const relatedSchemas = computed(() => {
    return findRelatedSchemas(currentPageSchema.value.children)
  })
  
  
  const canvasStore = useCanvasStore()
  const selectSchema = (id: string) => {
    canvasStore.selectNodeById(id)
    visible.value = false
  }
</script>

<template>
  <n-modal v-model:show="visible" preset="card" title="绑定关系" :bordered="false" style="width: 600px;" :mask-closable="false">
    <div class="flex flex-col">
      <div v-for="s in relatedSchemas" :key="s.id" class="mb-4px bg-#CCC text-center cursor-pointer" @click="selectSchema(s.id)">
        {{ s.componentName }}[{{ s.tagName }}]
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end">
        <n-button @click="visible = false" type="primary">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>

</style>