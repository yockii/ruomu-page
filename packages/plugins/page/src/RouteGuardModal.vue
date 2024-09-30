<script setup lang="ts">
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { NButton, NModal, NPopconfirm } from 'naive-ui'
  import { ref, watch } from 'vue'
  import { JsEditor } from '@ruomu-ui/editor'

  const projectStore = useProjectStore()
  const { project, projectDirt } = storeToRefs(projectStore)
  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  })
  
  const editableCode = ref('')
  const confirm = () => {
    const cs = editableCode.value.split('\n')
    const code = cs.slice(1, cs.length - 1).join('\n')
    if (project.value.routeGuard) {
      project.value.routeGuard.beforeEnter = code
    } else {
      project.value.routeGuard = {
        beforeEnter: code
      }
    }
    visible.value = false
    projectDirt.value = true
  }
  
  watch(() => project.value.routeGuard?.beforeEnter, () => {
    const code = project.value.routeGuard?.beforeEnter || ''
    editableCode.value = `function beforeEnter(to, from, next) {\n${code}\n}`
  })
  const params = ["to", "from", "next"]
</script>

<template>

  <n-modal v-model:show="visible" :mask-closable="false" preset="card" title="路由守卫"
           style="width: 800px;" :bordered="false">
    <div>
      <div class="text-12px">可使用store获取存储的项目级变量，to/from/next 见vue-router定义</div>
      <div class="code">
        <js-editor method-name="beforeEnter" v-model:code="editableCode" :params="params" editable />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <div class="flex-1">
          <n-popconfirm @positive-click="editableCode = ''" >
            <template #trigger>
              <n-button type="error">清空代码</n-button>
            </template>
            确定清空代码吗？
          </n-popconfirm>
        </div>
        <div class="flex-1 flex justify-end">
          <n-button class="mr-8px" @click.prevent="visible = false">取消</n-button>
          <n-button type="primary" @click.prevent="confirm">确定</n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
.code {
  width: 100%;
  height: calc(100% - 120px);
}
</style>