<script setup lang="ts">
  import {
    NModal,
    NButton,
    NPopconfirm,
    NForm,
    NFormItem,
    NFormItemGi,
    NInput,
    NGrid,
    NSelect,
    NDivider,
    NTabs,
    NTabPane,
    FormInst,
  } from 'naive-ui'
  import { ApiDefinition } from '@ruomu-ui/types'
  import { computed, PropType, ref } from 'vue'
  import { JsEditor, JsonViewer } from '@ruomu-ui/editor'
  import {http} from '@ruomu-ui/api'

  const visible = defineModel('visible', {
    type: Boolean,
    default: false
  })
  const api = defineModel('api', {
    type: Object as PropType<ApiDefinition>,
    required: true
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
  
  // form
  const formRef = ref<FormInst | null>(null)
  const rules = {
    name: {
      required: true,
      message: '请输入接口名称',
      trigger: 'blur'
    },
    url: {
      required: true,
      message: '请输入接口地址',
      trigger: 'blur'
    },
    method: {
      required: true,
      message: '请选择请求方式',
      trigger: 'blur'
    }
  }
  
  const currentTabName = ref('request')
  
  const requestMethodName = computed(() => {
    // doPost/ doGet形式， 把method的转为首字母大写，其他字母小写
    return 'do' + api.value.method.charAt(0).toUpperCase() + api.value.method.slice(1).toLowerCase()
  })
  const requestCode = ref('')
  const requestParams = ref(['config'])
  
  const responseValue = ref('')
  
  const doRequest = () => {
    if(!api.value.url || !api.value.method) {
      return
    }
    
    const vs = requestCode.value.split('\n')
    const v = vs.slice(1, vs.length - 1).join('\n')
    // v 就是赋值语句
    const config:Record<string, any> = {}
    //@ts-ignore
    const fn = (config:Record<string, any>) => {
      eval(v)
    }
    fn(config)
    config.url = api.value.url
    config.method = api.value.method
    http.request(config).then(res => {
      responseValue.value = res.data
      currentTabName.value = 'response'
    })
  }
</script>

<template>
  <n-modal v-model:show="visible" :mask-closable="false" preset="card" :title="api.label || api.name" style="width: 800px;" :bordered="false">
    <div class="api-info">
      <n-form ref="formRef" :model="api" :rules="rules" label-placement="left" label-width="auto" size="small">
        <n-grid :cols="24" :x-gap="16">
          <n-form-item-gi :span="12" label="接口显示名称" path="label">
            <n-input v-model:value="api.label" placeholder="请输入接口显示名称" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="接口调用名称" path="name">
            <n-input v-model:value="api.name" placeholder="请输入接口调用名称" />
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="24" :x-gap="16">
          <n-form-item-gi :span="3" path="method">
            <n-select v-model:value="api.method" placeholder="请选择请求方式" :options="[
              {
                label: 'GET',
                value: 'GET'
              },
              {
                label: 'POST',
                value: 'POST'
              },
              {
                label: 'PUT',
                value: 'PUT'
              },
              {
                label: 'DELETE',
                value: 'DELETE'
              }
            ]" />
          </n-form-item-gi>
          <n-form-item-gi :span="21" path="url">
            <n-input v-model:value="api.url" placeholder="请输入接口地址" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="说明" label-placement="top">
          <n-input v-model:value="api.description" type="textarea" placeholder="请输入接口说明" :rows="2" />
        </n-form-item>
        <n-divider style="margin:0;--n-color: #18A058;" title-placement="left">模拟请求</n-divider>
        <div class="text-12px">模拟请求中对请求的config处理，应在实际调用中做相应处理</div>
        <n-tabs v-model:value="currentTabName" type="line" justify-content="space-between" animated>
          <n-tab-pane name="request" tab="请求参数处理">
            <div class="flex justify-between">
              <span class="text-12px">参数请参考axios的config => {params,data,headers}, 直接赋值</span>
              <n-button size="tiny" type="primary" @click="doRequest">发送请求</n-button>
            </div>
            <div class="h-280px mt-8px">
              <js-editor :method-name="requestMethodName" v-model:code="requestCode" :params="requestParams" editable />
            </div>
          </n-tab-pane>
          <n-tab-pane name="response" tab="响应数据展示">
            <div class="h-280px mt-8px">
              <json-viewer :json-value="responseValue" />
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-form>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <n-popconfirm @positive-click="emit('delete')">
          <template #trigger>
            <n-button type="error">删除</n-button>
          </template>
            确定删除？
        </n-popconfirm>
        <div class="flex justify-end">
          <n-button class="mr-8px" @click.prevent="visible = false">取消</n-button>
          <n-button type="primary" @click.prevent="confirm">确定</n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
.api-info {
  overflow-y: auto;
  max-height: calc(100vh - 360px);
  scrollbar-width: thin;
  scrollbar-color: #18A058 #18A05850;
}
</style>