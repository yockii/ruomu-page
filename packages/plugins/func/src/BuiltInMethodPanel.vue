<script setup lang="ts">
  import { NButton, NIcon, NPopconfirm, NTooltip } from 'naive-ui'
  import { Close, Unknown } from '@vicons/carbon'
  import { JsEditor } from '@ruomu-ui/editor'
  import { nextTick, ref, watch } from 'vue'

  const props = defineProps({
    methodName: {
      type: String,
      required: true
    },
  })
  const code = defineModel('code', {
    type: String,
    default: ''
  })
  const emit = defineEmits(['confirm', 'close'])
  
  const params: string[] = []
  
  const showEditor = ref(true)
  
  watch(() => props.methodName, () => {
    showEditor.value = false
    nextTick(() => {
      showEditor.value = true
    })
  })
</script>

<template>
  <div class="method-panel">
    <div class="mx-4px my-4px flex justify-between">
      <div>{{methodName}}</div>
      <n-tooltip>
        <template #trigger>
          <n-icon class="cursor-pointer ml-8px" size="24" @click="emit('close')">
            <Close />
          </n-icon>
        </template>
        <span>关闭面板</span>
      </n-tooltip>
    </div>
    <div class="flex flex-col mt-4px mx-4px">
      <div class="flex items-center mx-4px my-4px text-12px">
          <span>
            支持：state、api、router、store
          </span>
        <n-tooltip>
          <template #trigger>
            <n-icon size="12" class="ml-8px cursor-pointer">
              <Unknown />
            </n-icon>
          </template>
          <p>
            可直接使用state变量，作为页面数据的引用。如页面数据中定义了一个 variable1,则代码中可以直接使用state.variable1
            获取其值;
          </p>
          <p>
            项目级的store同理，可以直接引用并使用;
          </p>
          <p>
            api接口使用api引入，如定义了调用名为login的api,则可以写：api.login(config).then(res => {...})；
          </p>
          <p>
            路由跳转使用router.push(url)，如：router.push('/login')
          </p>
        </n-tooltip>
      </div>
      <div class="code-area">
        <js-editor v-if="showEditor" v-model:code="code" :method-name="methodName" :params="params" editable />
      </div>
    </div>

    <div class="footer">
      <div>
        <n-popconfirm @positive-click="code = ''">
          <template #trigger>
            <n-button size="small" type="error" class="ml-8px">清空</n-button>
          </template>
          <span>确定清空该方法？</span>
        </n-popconfirm>
      </div>
      <div>
        <n-button class="mr-8px" size="small" type="primary" @click="emit('confirm')">确认</n-button>
        <n-button class="mr-8px" size="small" text @click="emit('close')">取消</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .method-panel {
    width: 800px;
    height: calc(100vh - 40px);
    position: absolute;
    top: -40px;
    left: 241px;
    background-color: #FFF;
    border-right: 1px solid #666;

    .code-area {
      margin-top: 8px;
      height: calc(100vh - 150px);
    }

    .footer {
      z-index: 9;
      position: absolute;
      bottom: 8px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
</style>