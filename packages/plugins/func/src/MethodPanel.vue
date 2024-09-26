<script setup lang="ts">
  import type { JsMethod, Parameter } from '@ruomu-ui/types'
  import { computed, nextTick, onMounted, PropType, ref, watch } from 'vue'
  import { NIcon, NTooltip, NInput, NButtonGroup, NButton, NPopconfirm } from 'naive-ui'
  import { Close } from '@vicons/carbon'
  import { Settings } from '@vicons/tabler'
  import { JsEditor } from '@ruomu-ui/editor'
  import ParamSettings from './ParamSettings.vue'
  import BindRelation from './BindRelation.vue'

  const props = defineProps({
    method: {
      type: Object as PropType<JsMethod>,
      required: true
    }
  })
  const emit = defineEmits(['close', 'confirm', 'remove'])
  
  
  const showNameInput = ref(false)
  
  const name = ref('')
  const editName = () => {
    name.value = props.method?.name || ''
    showNameInput.value = true
  }
  const nameAllowed = (value: string) => {
    // js方法名只能包含字母、数字、下划线
    return /^[a-zA-Z_]\w*$/.test(value)
  }
  const confirmName = () => {
    props.method.name = name.value
    showNameInput.value = false
  }
  
  const showDescriptionInput = ref(false)
  const description = ref('')
  const editDescription = () => {
    description.value = props.method?.description || ''
    showDescriptionInput.value = true
  }
  const confirmDescription = () => {
    props.method.description = description.value
    showDescriptionInput.value = false
  }
  
  const codeEditable = computed(() => {
    return !!props.method.name
  })
  const editableCode = ref('')

  const showEditor = ref(true)
  
  // watch(() => props.method.code, () => {
  //   editableCode.value = `function ${props.method.name}(${params}) {\n${props.method.code || ''}\n}`
  // })
  watch(() => props.method.id, () => {
    showEditor.value = false
    nextTick(() => {
      editableCode.value = `function ${props.method.name}(${paramStringArray.value.join(', ')}) {\n${props.method.code || ''}\n}`
      showEditor.value = true
    })
  })
  
  onMounted(() => {
    if(props.method.name === '') {
      editName()
    }
    const params = paramStringArray.value.join(', ')
    editableCode.value = `function ${props.method.name}(${params}) {\n${props.method.code || ''}\n}`
  })

// 参数设置
  const paramStringArray = computed(() => {
    // return props.method.params?.map(p => `${p.name}: ${p.type}`) || []
    // return props.method.params?.map(p => `${p.name}`) || []
    return props.method.params || []
  })
  
  const params = ref<Parameter[]>([])
  const paramsUpdated = (params: Parameter[]) => {
    // props.method.params 可能不存在
    props.method.params = params
  }
  const paramsDialogVisible = ref(false)
  const showParamsDialog = () => {
    params.value = props.method.params || []
    paramsDialogVisible.value = true
  }
  
  const confirmAddMethod = () => {
    const code = editableCode.value
    // 去掉首尾行
    const lines = code.split('\n')
    lines.shift()
    lines.pop()
    emit('confirm', lines.join('\n'))
  }
  
  const showBindRelation = ref(false)
</script>

<template>
  <div class="method-panel">
    <div class="flex justify-between items-center mt-4px ml-4px">
      <div v-if="showNameInput" class="flex">
        <n-input v-model:value="name" size="small" placeholder="请设置方法名" :allow-input="nameAllowed"/>
        <n-button-group size="small" class="ml-4px">
          <n-button type="primary" @click="confirmName">确定</n-button>
          <n-button @click="showNameInput = false">取消</n-button>
        </n-button-group>
      </div>
      <div v-else class="flex items-center">
        <span class="mr-4px">方法名:</span>
        <span>{{ method.name }}</span>
        <n-tooltip>
          <template #trigger>          
            <n-icon size="14" @click="editName" class="ml-8px cursor-pointer">
              <Settings />
            </n-icon>
          </template>
          <span>设置方法名</span>
        </n-tooltip>
      </div>
      <n-tooltip>
        <template #trigger>
          <n-icon class="cursor-pointer ml-8px" size="24" @click="emit('close')">
            <Close />
          </n-icon>
        </template>
        <span>关闭面板</span>
      </n-tooltip>
    </div>
    
    <div class="mt-4px mx-4px">
      <div v-if="showDescriptionInput" class="flex">
        <n-input v-model:value="description" size="small" placeholder="请设置方法名" />
        <n-button-group size="small" class="ml-4px">
          <n-button type="primary" @click="confirmDescription">确定</n-button>
          <n-button @click="showDescriptionInput = false">取消</n-button>
        </n-button-group>
      </div>
      <div v-else class="flex items-center">
        <span class="mr-4px">说明:</span>
        <span>{{ method.description }}</span>
        <n-tooltip>
          <template #trigger>
            <n-icon size="14" @click="editDescription" class="ml-8px cursor-pointer">
              <Settings />
            </n-icon>
          </template>
          <span>设置方法说明</span>
        </n-tooltip>
      </div>
    </div>
    <div class="mt-4px mx4px flex justify-between">
      <n-button size="small" text @click="showParamsDialog">参数设置</n-button>
      <n-button size="small" text @click="showBindRelation = true">绑定关系</n-button>
    </div>
    <param-settings v-model:visible="paramsDialogVisible" :params="params" @update:params="paramsUpdated"/>
    <bind-relation v-if="method.id && showBindRelation" v-model:visible="showBindRelation" :method-id="method.id" />
    
    <p class="text-12px p-8px">说明：可直接使用state变量，作为页面数据的引用。如页面数据中定义了一个 variable1,则代码中可以直接使用state.variable1 获取其值; 项目级的store同理，可以直接引用并使用; api接口使用api引入，如定义了调用名为login的api,则可以写：api.login(config).then(res => {...})</p>
    
    <div class="code-area">
      <div v-if="!codeEditable" class="text-center text-gray-400 text-12px">请先设置方法名</div>
      <js-editor v-if="showEditor" v-model:code="editableCode" :method-name="method.name || 'newFunction'" :params="paramStringArray" :editable="codeEditable" />
    </div>
    
    <div class="footer">
      <div>
        <n-popconfirm @positive-click="emit('remove')" v-if="method.id">
          <template #trigger>
            <n-button size="small" type="error" class="ml-8px">删除</n-button>
          </template>
          <span>确定删除该方法？</span>
        </n-popconfirm>
      </div>
      <div>
        <n-button class="mr-8px" size="small" type="primary" @click="confirmAddMethod">确认</n-button>
        <n-button class="mr-8px" size="small" text @click="emit('close')">取消</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .method-panel {
    width: 480px;
    height: calc(100vh - 40px);
    position: absolute;
    top: -40px;
    left: 181px;
    background-color: #FFF;
    border-right: 1px solid #666;
    
    .code-area {
      margin-top: 8px;
      height: calc(100% - 160px);
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