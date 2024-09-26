<script setup lang="ts">
  import { deepClone, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { NButton, NTooltip, NTag } from 'naive-ui'
  import { Plus } from '@vicons/tabler'
  import ActionPanel from './actionPanel.vue'
  import { ApiDefinition } from '@ruomu-ui/types'
  import ApiModal from './ApiModal.vue'

  const projectStore = useProjectStore()
  const { project } = storeToRefs(projectStore)
  const apiList = computed(() => project.value?.api?.apiList || [])
  
  const isPreAction = ref(false)
  const actionPanelVisible = ref(false)
  const openActionPanel = (isPre: boolean) => {
    isPreAction.value = isPre
    actionPanelVisible.value = true
  }
  const confirmAction = (code: string) => {
    if (!project.value.api) {
      project.value.api = {
        preAction: '',
        postAction: '',
        apiList: []
      }
    }
    if (isPreAction.value) {
      project.value.api.preAction = code
    } else {
      project.value.api.postAction = code
    }
  }
  
  // 以下 api 相关
  const apiModalVisible = ref(false)
  const currentApi = ref<ApiDefinition>({
    name: '',
    method: 'GET',
    url: '',
  })
  const resetCurrentApi = (v?:ApiDefinition) => {
    currentApi.value = deepClone(v) || {
      name: '',
      label: '新接口',
      method: 'GET',
      url: '',
    }
  }
  const tagType = (method: string) => {
    switch (method) {
      case 'GET':
        return 'success'
      case 'POST':
        return 'warning'
      case 'PUT':
        return 'info'
      case 'DELETE':
        return 'error'
      default:
        return 'info'
    }
  }
  
  const openApiPanel = (api?: ApiDefinition) => {
    resetCurrentApi(api)
    apiModalVisible.value = true
  }
  const deleteApi = () => {
    project.value.api.apiList = project.value.api.apiList.filter((api:ApiDefinition) => api.id !== currentApi.value.id)
    apiModalVisible.value = false
  }
  const confirmApi = () => {
    if (!project.value.api) {
      project.value.api = {
        preAction: '',
        postAction: '',
        apiList: [currentApi.value]
      }
    } else if(!project.value.api.apiList) {
      project.value.api.apiList = [currentApi.value]
    } else if (!currentApi.value.id) {
      currentApi.value.id = Date.now().toString()
      project.value.api.apiList.push(currentApi.value)
    } else {
      const index = project.value.api.apiList.findIndex((api:ApiDefinition) => api.id === currentApi.value.id)
      if (index < 0) {
        currentApi.value.id = Date.now().toString()
        project.value.api.apiList.push(currentApi.value)
      } else {
        project.value.api.apiList[index] = currentApi.value
      }
    }
  }
</script>

<template>
  <div class="w-220px relative px-16px">
    <div class="flex items-center justify-between">
      <n-button size="tiny" @click="openActionPanel(true)">
        前置动作
      </n-button>
      <n-button size="tiny" @click="openActionPanel(false)">
        后置动作
      </n-button>
      <n-tooltip>
        <template #trigger>
          <n-button size="tiny" @click="openApiPanel()">
            <template #icon>
              <Plus />
            </template>
          </n-button>
        </template>
        <span>添加接口</span>
      </n-tooltip>
    </div>
    <div class="b-1px b-solid b-#eee my-8px" />
    <div class="api-container">
      <template v-for="api in apiList" :key="api.id">
        <n-tooltip>
          <template #trigger>
            <div :class="`${api.method.toLowerCase()}-api`" @click="openApiPanel(api)">
              <div><span>{{ api.label }}</span></div>
              <div class="flex items-center gap-8px">
                <n-tag size="small" :type="tagType(api.method)">{{ api.method }}</n-tag>
                <span>{{api.name}}</span>
              </div>
            </div>
          </template>
          {{api.url}}
        </n-tooltip>
      </template>
    </div>
  </div>
  
  <action-panel v-model:visible="actionPanelVisible" :is-pre-action="isPreAction" @confirm="confirmAction"/>
  
  <api-modal v-model:visible="apiModalVisible" v-model:api="currentApi" @confirm="confirmApi" @delete="deleteApi"/>
</template>

<style lang="less" scoped>
  .api-container {
    overflow-y: auto;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
    gap: 8px;
    scrollbar-width: thin;
    scrollbar-color: #18A058 #18A05850;
  }
  .get-api {
    cursor: pointer;
    color: #18A058;
    padding: 8px 16px;
    
    &:hover {
      color: white;
      background-color: #18A05890;
      box-shadow: 10px 10px 20px 6px rgba(24, 160, 88, 0.5);
    }
  }
  .post-api {
    cursor: pointer;
    color: #ff7ccb; // 橙色
    padding: 8px 16px;
    
    &:hover {
      color: white;
      background-color: #ff7ccb90;
      box-shadow: 10px 10px 20px 6px rgba(255, 124, 203, 0.5);
    }
  }
  .put-api {
    cursor: pointer;
    color: #ebaa47; // 橙色
    padding: 8px 16px;
    
    &:hover {
      color: white;
      background-color: #ebaa4790;
      box-shadow: 10px 10px 20px 6px rgba(235, 170, 71, 0.5);
    }
  }
  .delete-api {
    cursor: pointer;
    color: #f40101; // 橙色
    padding: 8px 16px;
    
    &:hover {
      color: white;
      background-color: #f4010190;
      box-shadow: 10px 10px 20px 6px rgba(245, 1, 1, 0.5);
    }
  }
</style>