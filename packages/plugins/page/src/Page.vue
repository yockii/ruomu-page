<script setup lang="ts">
  import { deepClone, useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import {NButton, NIcon, useMessage} from 'naive-ui'  
  import { TabAdd24Regular } from '@vicons/fluent'
  import EditPage from './EditPage.vue'
  import type { Page } from '@ruomu-ui/types'
  import { ref } from 'vue'
  import { PageApi, ProjectApi } from '@ruomu-ui/api'
  import RouteGuardModal from './RouteGuardModal.vue'

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {project, pages, currentPageSchema} = storeToRefs(projectStore)
  const message = useMessage()
  const editPageVisible = ref(false)
  const currentPage = ref<Page>({})
  const resetPage = (page?:Page) => {
    currentPage.value = deepClone(page) || {
      name: '新页面',
      projectId: project.value.id,
      route: '',
    }
  }
  const openEditPageModal = (page?:Page) => {
    resetPage(page)
    editPageVisible.value = true
  }
  
  const delPage = async () => {
    if (currentPage.value.id) {
      try {
        const resp = await PageApi.remove(currentPage.value.id)
        if (resp.code === 0) {
          pages.value = pages.value.filter((p: Page) => p.id !== currentPage.value.id)
        } else {
          message.error('删除页面失败：' + resp.msg)
        }
      } catch (error) {
        message.error('删除页面失败：' + error)
      }
    }
    editPageVisible.value = false
  }
  
  const confirmPage = async (dev = false) => {
    let needAdd = true
    if (currentPage.value.id) {
      // 替换pages中对应的
      const idx = pages.value.findIndex((p:Page) => p.id === currentPage.value.id)
      if (idx > -1) {
        // 比对是否有更新
        const old = pages.value[idx]
        if (
          old.name !== currentPage.value.name || 
          old.route !== currentPage.value.route ||
          old.fileName !== currentPage.value.fileName ||
          old.description !== currentPage.value.description
        ) {
          // 更新
          const resp = await PageApi.update(currentPage.value)
          if (resp.code === 0) {
            pages.value[idx] = currentPage.value
          } else {
            message.error('更新页面失败：' + resp.msg)
          }
        }
        
        
        pages.value[idx] = currentPage.value
        needAdd = false
        
      }
    }
    
    if (needAdd) {
      try {
        const resp = await PageApi.add(currentPage.value)
        if (resp.code === 0 && resp.data) {
          pages.value.push(resp.data)
          if (dev) {
            canvasStore.clearState()
            projectStore.getPageSchema(resp.data.id)
            currentPage.value.id = resp.data.id
          }
        } else {
          message.error('添加页面失败：' + resp.msg)
        }
      } catch (error) {
        message.error('添加页面失败：' + error)
      }
    } else if (dev) {
      canvasStore.clearState()
      projectStore.getPageSchema(currentPage.value.id)
    }
    
    if (currentPage.value.id && currentPage.value.setDefault && currentPage.value.id !== project.value.homePageId) {
      updateProjectHomePageId(currentPage.value.id)
    }
    
    
    editPageVisible.value = false
  }
  
  const updateProjectHomePageId = async (id: string) => {
    try {
      const resp = await ProjectApi.update({
        id: project.value.id,
        homePageId: id
      })
      if (resp.code === 0) {
        project.value.homePageId = id
      } else {
        message.error('设置首页失败：' + resp.msg)
      }
    } catch (error) {
      message.error('设置首页失败：' + error)
    }
  }
  
  ////////////
  // 路由守卫
  const showRouteGuardModal = ref(false)
  const openRouteGuardModal = () => {
    showRouteGuardModal.value = true
  }
</script>

<template>
  <div class="w-240px">
    <div class="page-container">
      <div class="mx-4px my-8px">
        <n-button size="tiny" block @click="openRouteGuardModal()">路由守卫</n-button>
        <n-button class="my-4px" block @click="openEditPageModal()">
          新增页面
          <template #icon>
            <n-icon>
              <TabAdd24Regular />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="page" v-for="page in pages" :class="{'active': page.id === currentPageSchema.id}" :key="page.id" @click="openEditPageModal(page)">
        <div class="">{{page.name}}</div>
        <div class="">{{page.route}}</div>
      </div>
    </div>
  </div>
  
  <edit-page v-model:page="currentPage" v-model:visible="editPageVisible" @confirm="confirmPage" @delete="delPage"/>
  <route-guard-modal v-model:visible="showRouteGuardModal" />
</template>

<style lang="less" scoped>
  .page-container {
    overflow-y: auto;
    height: calc(100vh - 80px);
    scrollbar-width: thin;
  }
  .page {
    cursor: pointer;
    padding: 8px;
    background: aliceblue;
  }
  .page.active {
    background: lightblue;
  }
  .page:hover {
    background: lightblue;
  }
</style>