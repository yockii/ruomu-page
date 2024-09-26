<script setup lang="ts">
  import type { Page } from '@ruomu-ui/types'
  import { PropType, ref } from 'vue'
  import {
    FormInst,
    NButton,
    NForm,
    NFormItem,
    NFormItemGi,
    NGrid,
    NInput,
    NModal,
    NPopconfirm,
    useMessage,
  } from 'naive-ui'
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const projectStore = useProjectStore()
  const { currentPageSchema, pageDirt } = storeToRefs(projectStore)

  const message = useMessage()
  
  
  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  })
  const page = defineModel('page', {
    type: Object as PropType<Page>,
    required: true,
  })

  const emit = defineEmits(['confirm', 'delete'])

  const confirm = async () => {
    try {
      await formRef.value?.validate()
    } catch (errors) {
      return
    }
    emit('confirm')
    visible.value = false
  }

  const confirmAndDev = async () => {
    try {
      await formRef.value?.validate()
    } catch (errors) {
      return
    }
    
    if(pageDirt.value) {
      message.warning('当前页面有改动为保存，无法直接切换新页面，请先确认添加新页面并保存当前页面的改动')
      return
    }
    
    // page.value.id = Date.now().toString()
    // page.value.schema = {
    //   id: page.value.id,
    //   componentId: 'page',
    //   componentName: 'page',
    //   tagName: '',
    //   props: {},
    //   js: {
    //     onMounted: '',
    //     onUnmounted: '',
    //     onUpdated: '',
    //     onBeforeMount: '',
    //     onBeforeUnmount: '',
    //     methods: [],
    //   },
    //   css: '',
    // }
    // currentPageSchema.value = page.value.schema

    emit('confirm', true)
    visible.value = false
  }
  const formRef = ref<FormInst | null>(null)
  const rules = {
    name: [
      { required: true, message: '请输入页面名称' },
    ],
    route: [
      { required: true, message: '请输入页面路由' },
      { pattern: /^\/[a-zA-Z0-9\/]*$/, message: '路由格式不正确' },
    ],
    fileName: [
      { required: true, message: '请输入页面文件名' },
      // **/*.vue 允许有文件夹
      { pattern: /^[a-zA-Z0-9\/]+\.vue$/, message: '文件名格式不正确, 请以.vue结尾' },
      
    ],
  }
</script>

<template>
  <n-modal v-model:show="visible" :mask-closable="false" preset="card" :title="page.name + ' [ ' + page.route + ' ]'"
           style="width: 800px;" :bordered="false">
    <div>
      <n-form ref="formRef" :model="page" label-placement="left" label-width="auto" size="small" :rules="rules">
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi :span="1" label="页面名称" path="name">
            <n-input v-model:value="page.name" placeholder="请输入页面名称" />
          </n-form-item-gi>
          <n-form-item-gi :span="1" label="页面文件" path="fileName">
            <n-input v-model:value="page.fileName" placeholder="请输入页面文件名" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="页面路由" path="route">
          <n-input v-model:value="page.route" placeholder="请输入页面路由" />
        </n-form-item>
        <n-form-item label="页面描述">
          <n-input v-model:value="page.description" placeholder="请输入页面描述" />
        </n-form-item>
      </n-form>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <div class="flex-1">
          <n-popconfirm @positive-click="emit('delete')" v-if="page.id">
            <template #trigger>
              <n-button type="error">删除</n-button>
            </template>
            确定删除？
          </n-popconfirm>
        </div>
        <div class="flex-1">
          <n-button v-if="page.id" block type="info" @click.prevent="confirmAndDev">进入开发</n-button>
          <n-button v-else block type="info" @click.prevent="confirmAndDev">保存并进入开发</n-button>
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

</style>