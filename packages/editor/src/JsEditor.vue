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
  // watch(() => props.code, () => {
  //   if (editorInstance) {
  //     editorInstance.setValue(satisfyCode.value)
  //   }
  // })

  const jsCode = computed({
    get: () => props.code,
    set: (v) => {
      // 如果只有2行，则2行的中间加一个空行
      if (v.split('\n').length === 2) {
        const vs = v.split('\n')
        const newV = [vs[0], '', vs[1]].join('\n')
        emit('update:code', newV)
      } else {
        emit('update:code', v)
      }
    },
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
  
  const satisfyCode = computed(() => {
    let editorCode = jsCode.value
    // 检查jsCode，如果只有2行，则2行的中间加一个空行
    const vs = jsCode.value.split('\n')
    if (vs.length === 2) {
      editorCode = [vs[0], '', vs[1]].join('\n')
    } else if (vs.length === 1) {
      // 如果有 function *** () {} 这种情况，则在{}中添加一个空行
      const v = vs[0]
      const reg = /function\s+\w+\s*\(.*\)\s*\{\s*}/
      if (reg.test(v)) {
        editorCode = v.replace(/\{\s*}\s*$/, '{\n\n}')
      } else {
        // 检查是否有 function *** () 这种情况，有则后面增加 {\n\n}
        const reg2 = /function\s+\w+\s*\(.*\)/
        if (reg2.test(v)) {
          editorCode = v.replace(/\s*$/, ' {\n\n}')
        } else {
          // 尝试包裹一层function ${methodName}(params) {\n ${vs} \n}
          const params = props.params.join(', ')
          editorCode = `function ${methodName.value}(${params}) {\n ${vs.join('\n')} \n}`
        }
      }
    }
    return editorCode
  })

  const editorInit = async () => {
    const m = await loader.init()
    
    let editorCode = satisfyCode.value
    
    editorInstance = m.editor.create(editorContainer.value!, {
      value: editorCode,
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