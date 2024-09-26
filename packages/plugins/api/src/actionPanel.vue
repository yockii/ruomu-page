<script setup lang="ts">
  import { NModal, NButton} from 'naive-ui'
  import { computed, ref, watch } from 'vue'
  import { JsEditor } from '@ruomu-ui/editor'
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    isPreAction: {
      type: Boolean,
      default: false
    },
  })
  const emit = defineEmits(['update:visible', 'confirm'])

  const projectStore = useProjectStore()
  const { project } = storeToRefs(projectStore)
  const preAction = computed(() => project.value?.api?.preAction || '')
  const postAction = computed(() => project.value?.api?.postAction || '')
  
  const code = ref('')
  
  const title = computed(() => {
    return `${props.isPreAction ? '前置' : '后置'}动作`
  })
  
  const confirm = () => {
    emit('confirm', code.value)
    emit('update:visible', false)
  }
  
  const editableCode = computed({ 
    get: () => `function ${methodName.value}(${params.value.join(', ')}) {\n${code.value}\n}`,
    set: (v) => {
      // 去掉 function 和 {}
      const vs = v.split('\n')
      code.value = vs.slice(1, vs.length - 1).join('\n')
    }
  })
  
  const methodName = computed(() => {
    return props.isPreAction ? 'preAction' : 'postAction'
  })
  const params = computed(() => {
    return props.isPreAction ? ['config'] : ['response']
  })
  
  
  watch(() => props.isPreAction, () => {
    code.value = props.isPreAction ? preAction.value: postAction.value
  })
  
</script>

<template>
  <n-modal :show="visible" @update:show="v => emit('update:visible', v)" :mask-closable="false" preset="card" :title="title" style="width: 800px;" :bordered="false">
    <div class="text-12px p-8px">
      参数具体内容请参考axios对应拦截器中的<span v-if="isPreAction">request.use</span><span v-else>response.use</span>的参数; 务必返回<span v-if="isPreAction">config</span><span v-else>数据</span>；可以使用项目级store中的变量
    </div>
    <div class="w-100% h-600px">
      <js-editor v-model:code="editableCode" :methodName="isPreAction?'preAction':'postAction'" :params="params" editable />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <n-button class="mr-8px" @click="emit('update:visible', false)">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>

</style>