<script setup lang="ts">
  import { NButton, NForm, NFormItem, NIcon, NInput, NSelect, NModal, NTag, type FormInst } from 'naive-ui'
  import { Plus } from '@vicons/tabler'
  import type { Variable } from '@ruomu-ui/types'
  import { computed, ref } from 'vue'

  const emit = defineEmits(['cancel', 'confirm', 'del'])

  const props = defineProps<{
    currentState: Variable,
    needDelete?: boolean,
  }>()

  const rules = {
    name: [
      {
        required: true,
        message: '名称不能为空',
        trigger: 'blur',
      },
    ],
    type: [
      {
        required: true,
        message: '类型不能为空',
        trigger: 'blur',
      },
    ],
  }
  
  const variableForm = ref<FormInst | null>(null)
  const confirmAddNewVariable = () => {
    variableForm.value?.validate((errors) => {
      if (errors) {
        return
      }
      emit('confirm')
    })
  }

  const showAddPropDialog = ref(false)

  // 属性字段
  const currentProp = ref<Variable | null>(null)
  const addNewProp = () => {
    if (currentProp.value !== null) {
      return
    }
    currentProp.value = {
      name: '',
      type: 'any',
    }
    showAddPropDialog.value = true
  }
  const updateProp = (prop: Variable) => {
    currentProp.value = prop
    showAddPropDialog.value = true
  }

  const cancel = () => {
    showAddPropDialog.value = false
  }

  const propForm = ref<FormInst | null>(null)
  const confirm = () => {
    if (!currentProp.value) return
    
    propForm.value?.validate((errors) => {
      if (errors) {
        return
      }
    
      if (!props.currentState.props || props.currentState.props.length === 0) {
        props.currentState.props = [currentProp.value!]
      } else {
        props.currentState.props.push(currentProp.value!)
      }
  
      showAddPropDialog.value = false
    })
  }
  
  const hasProp = computed(() => props.currentState.props?.findIndex(item => item.name === currentProp.value?.name) > -1)
  const delProp = () => {
    // 从属性列表删除
    const index = props.currentState.props!.findIndex(prop => prop.name === currentProp.value!.name)
    if (index !== -1) {
      props.currentState.props!.splice(index, 1)
    }
    currentProp.value = null
    showAddPropDialog.value = false
  }
</script>

<template>
  <div class="mt-8px mx-4px">
    <n-form ref="variableForm" :model="currentState" :rules="rules" label-placement="left" label-align="left" label-width="60">
      <n-form-item label="名称" path="name">
        <n-input v-model:value="currentState.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-select v-model:value="currentState.type" :options="[
            {
              label: '字符串',
              value: 'string'
            },
            {
              label: '数字',
              value: 'number'
            },
            {
              label: '布尔',
              value: 'boolean'
            },
            {
              label: '对象',
              value: 'object'
            },
            {
              label: '数组',
              value: 'array'
            }
          ]" />
      </n-form-item>
      <n-form-item v-if="currentState.type !== 'array' && currentState.type !== 'object' && currentState.type !== 'any'" label="默认值" path="defaultValue">
        <n-input v-model:value="currentState.defaultValue" placeholder="请输入默认值" />
      </n-form-item>
      <n-form-item label="属性" v-if="currentState.type === 'object'">
        <n-button text :focusable="false" @click.stop="addNewProp">
          <template #icon>
            <n-icon>
              <Plus />
            </n-icon>
          </template>
          增加属性字段
        </n-button>
      </n-form-item>
      <div>
        <template v-for="prop in currentState.props" :key="prop.name">
          <n-tag class="mr-8px cursor-pointer" @click="updateProp(prop)">{{ prop.name }}</n-tag>
        </template>
      </div>
    </n-form>
    <div class="mt-8px flex justify-around">
      <div class="flex-1">
        <n-button v-if="needDelete" type="error" @click="emit('del')">删除</n-button>
      </div>
      <div class="flex-1">
        <n-button block :focusable="false" @click.stop="emit('cancel')">取消</n-button>
      </div>
      <div class="flex-1 ml-8px">
        <n-button block :focusable="false" type="primary" @click.stop="confirmAddNewVariable">确定</n-button>
      </div>
    </div>
  </div>

  <n-modal v-model:show="showAddPropDialog" preset="card" class="w-320px" @after-leave="currentProp = null">
    <n-form ref="propForm" :model="currentProp!" :rules="rules" label-placement="left" label-align="left" label-width="60">
      <n-form-item label="名称" path="name">
        <n-input v-if="currentProp" v-model:value="currentProp!.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-select v-if="currentProp" v-model:value="currentProp!.type" :options="[
            {
              label: '字符串',
              value: 'string'
            },
            {
              label: '数字',
              value: 'number'
            },
            {
              label: '布尔',
              value: 'boolean'
            },
            {
              label: '对象',
              value: 'object'
            },
            {
              label: '数组',
              value: 'array'
            },
            {
              label: '任意',
              value: 'any'
            }
          ]" />
      </n-form-item>
      <n-form-item
        v-if="currentProp && (currentProp!.type === 'string' || currentProp!.type === 'number' || currentProp!.type === 'boolean')"
        label="默认值" path="defaultValue">
        <n-input v-model:value="currentProp!.defaultValue" placeholder="请输入默认值" />
      </n-form-item>
    </n-form>
    <template #footer>
      <div class="flex justify-between">
        <div>
          <n-button v-if="hasProp" @click="delProp" type="error">删除</n-button>
        </div>
        <div class="flex">
          <n-button @click="cancel">取消</n-button>
          <n-button class="ml-8px" type="primary" @click="confirm">确定</n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>

</style>