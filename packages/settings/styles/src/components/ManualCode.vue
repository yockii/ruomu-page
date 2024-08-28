<script setup lang="ts">
import { NButton, NModal, NCard, NTooltip, NIcon, NIconWrapper } from 'naive-ui'
import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { SingleStyleEditor } from '@ruomu-ui/editor'
import { QuestionMark } from '@vicons/tabler'

const canvasStore = useCanvasStore()
const projectStore = useProjectStore()
const {selectState} = storeToRefs(canvasStore)

const manualStyleValue = computed(() => {
  const schema = projectStore.findSchemaSegment(selectState.value.id)
  return schema?.style || ''
}) 

const dialogVisible = ref(false)
const editableStyle = ref('')

const showDialog = () => {
  editableStyle.value = `:root {\n ${manualStyleValue.value}\n}`
  dialogVisible.value = true
}

const confirm = () => {
  // 把前后的{} 去掉
  const result = editableStyle.value.replace(/^:root {/, '').replace(/}$/, '').replace(/\n/g, '')
  projectStore.updateSchemaStyleValue(selectState.value.id, result)
  dialogVisible.value = false
}
</script>

<template>
  <div class="flex w-100%">
    <div class="flex-1">
      <n-button block size="tiny" :type="manualStyleValue ? 'primary' : 'tertiary'" @click="showDialog">手动编写</n-button>
    </div>
    <div class="mx-4px">
      <n-tooltip>
        <template #trigger>
          <n-icon-wrapper :border-radius="10" :size="20">
            <n-icon>
              <QuestionMark />
            </n-icon>
          </n-icon-wrapper>
        </template>
        <span>手动编写行内css样式，拥有最高优先级，会覆盖下方的设置</span>
      </n-tooltip>
    </div>
  </div>
  <n-modal v-model:show="dialogVisible" title="手动编写" :show-close="false" :show-cancel="false" :show-ok="false">
    <n-card
      style="width: 800px"
      title="手动编写样式"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <single-style-editor v-model:value="editableStyle" />
      <template #footer>
        <div class="flex justify-end">
          <n-button size="small" type="primary" @click="confirm">确定</n-button>
          <n-button class="ml-8px" size="small" type="default" @click="dialogVisible = false">取消</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>