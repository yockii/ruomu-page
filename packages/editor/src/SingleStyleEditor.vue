<script setup lang="ts">
  import loader from '@monaco-editor/loader'
  import * as monaco from 'monaco-editor'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  
  const props = defineProps({
    value: {
      type: String,
      required: true,
    }
  })
  const emit = defineEmits(['update:value'])
  
  const styleValue = computed({
    get: () => props.value,
    set: (v) => emit('update:value', v),
  })
  
  const allowedRange = () => {
    let startLineNumber = 1
    let endLineNumber = 1
    // 从 editor.getValue 中提取出行数范围
    if (editorInstance) {
      const content = editorInstance.getValue()
      if (content) {
        const lines = content.split('\n')
        startLineNumber = lines.findIndex(line => line.trim().includes('{')) + 1
        endLineNumber = lines.findIndex(line => line.trim().endsWith('}')) + 1
      }
    }
    
    return {
      startLineNumber,
      endLineNumber,
    }
  }
  
  // 用于存储编辑器实例
  let editorInstance :  monaco.editor.IStandaloneCodeEditor | null = null
  const editorContainer = ref<HTMLDivElement | null>(null)
  
  const handleCursorChange = (event: monaco.editor.ICursorPositionChangedEvent) => {
    const model = editorInstance?.getModel()
    if (!model) return

    const position = event.position
    const ar = allowedRange()
    if (position.lineNumber <= ar.startLineNumber || position.lineNumber >= ar.endLineNumber) {
      editorInstance?.updateOptions({
        readOnly: true,
      })
    } else {
      editorInstance?.updateOptions({readOnly: false})
    }

  }
  
  const editorInit = async () => {
    const m = await loader.init()
    editorInstance = m.editor.create(editorContainer.value!, {
        value: styleValue.value,
        language: 'css',
      })
      
    editorInstance.onDidChangeCursorPosition(handleCursorChange)
    editorInstance.onDidChangeModelContent(() => {
      styleValue.value = editorInstance?.getValue() || ''
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
  .allowed-edit-area {
    background-color: rgba(0, 255, 0, 0.2); /* 绿色背景用于示例 */
  }
</style>