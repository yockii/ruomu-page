<script setup lang="ts">
  import loader from '@monaco-editor/loader'
  import * as monaco from 'monaco-editor'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  
  const props = defineProps({
    jsonValue: {
      type: String,
      required: true,
    }
  })
  
  const v = computed(() => JSON.stringify(props.jsonValue, null, "\t"))
  
  // 用于存储编辑器实例
  let editorInstance :  monaco.editor.IStandaloneCodeEditor | null = null
  const editorContainer = ref<HTMLDivElement | null>(null)
  
  const editorInit = async () => {
    const m = await loader.init()
    editorInstance = m.editor.create(editorContainer.value!, {
        value: v.value,
        language: 'json',
        readOnly: true,
      })
  }
  
  onMounted(() => {
    editorInit()
  })
    
  onBeforeUnmount(() => {
    editorInstance?.dispose()
  })
    
</script>

<template>
  <div ref="editorContainer" class="w-100% h-100% min-h-600px"></div>
</template>

<style scoped>

</style>