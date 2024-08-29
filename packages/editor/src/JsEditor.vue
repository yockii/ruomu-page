<script setup lang="ts">
  import loader from '@monaco-editor/loader'
  import * as monaco from 'monaco-editor'
  import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

  const props = defineProps({
    code: {
      type: String,
      required: true,
    },
    methodName: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    params: {
      // String[]
      type: Array,
      default: () => [],
    }
  })
  const emit = defineEmits(['update:code'])
  const { methodName } = toRefs(props)
  
  watch(() => methodName.value, () => {
    const c = editorInstance?.getValue()
    if (!c) return
    if (editorInstance) {
      editorInstance.setValue(c.replace(/function\s+\w+\s*\(/, `function ${methodName.value}(`))
    }
  })
  watch(() => props.params, () => {
    const c = editorInstance?.getValue()
    if (!c) return
    if (editorInstance) {
      const params = props.params.join(', ')
      // 注意这里的正则表达式，匹配的是函数参数部分，不要匹配到函数体
      // 只取第一行，因为函数参数部分只会在第一行
      const lines = c.split('\n')
      const firstLine = lines[0]
      const firstLineResult = firstLine.replace(/\(.*\)/, `(${params})`)
      const result = [firstLineResult, ...lines.slice(1)].join('\n')
      editorInstance.setValue(result)
    }
  })

  const jsCode = computed({
    get: () => props.code,
     set: (v) => emit('update:code', v),
  })

  const allowedRange = () => {
    let startLineNumber = 1
    let endLineNumber = 1
    // 从 editor.getValue 中提取出行数范围
    if (editorInstance) {
      const content = editorInstance.getValue()
      if (content) {
        const lines = content.split('\n')
        endLineNumber = lines.length
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
    if (!props.editable) {
      editorInstance?.updateOptions({
        readOnly: true,
      })
      return
    }

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
      value: jsCode.value,
      language: 'javascript',
    })

    editorInstance.onDidChangeCursorPosition(handleCursorChange)
    editorInstance.onDidChangeModelContent(() => {
      jsCode.value = editorInstance?.getValue() || ''
    })
    if (!props.editable) {
      editorInstance.updateOptions({
        readOnly: true,
      })
    }
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