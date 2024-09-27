<script setup lang="ts">
  import loader from '@monaco-editor/loader'
  import * as monaco from 'monaco-editor'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const props = defineProps({
    editable: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'html'
    }
  })
  const code = defineModel('code', {
    type: String,
    required: true,
  })

  let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null
  const editorContainer = ref<HTMLDivElement | null>(null)
  
  const editorInit = async () => {
    const m = await loader.init()
    editorInstance = m.editor.create(editorContainer.value!, {
      value: code.value,
      language: props.language,
    })

    editorInstance.onDidChangeModelContent(() => {
      code.value = editorInstance?.getValue() || ''
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