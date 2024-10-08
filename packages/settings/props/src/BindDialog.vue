<script setup lang="ts">
  import type { Property, Variable } from '@ruomu-ui/types'
  import { ref, computed, PropType, onMounted } from 'vue'
  import { NModal, NInput, NDivider, NButton, NCheckbox, NGrid, NGridItem, NTag, NTooltip, useDialog } from 'naive-ui'
  import { useCanvasStore, useLayoutStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import Func, { usePluginFunctionStore } from '@ruomu-ui/plugin-function'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    property: {
      type: Object as PropType<Property>,
      required: true,
    },
  })
  const emit = defineEmits(['update:visible'])

  const pluginFunctionStore = usePluginFunctionStore()
  const { currentMethod, showMethodPanel } = storeToRefs(pluginFunctionStore)
  const layoutStore = useLayoutStore()
  const { currentPlugin, showPluginPanel } = storeToRefs(layoutStore)

  // 当前的schema
  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  const { selectState } = storeToRefs(canvasStore)
  const { currentPageSchema, project } = storeToRefs(projectStore)

  const currentSchema = computed(() => {
    return projectStore.findSchemaSegment(selectState.value.id)
  })
  const relatedProp = computed(() => currentSchema.value?.relatedProps?.[props.property.name])

  const stateList = computed(() => currentPageSchema.value?.state)
  const storeList = computed(() => project.value?.store)

  const toggleVisible = (v: boolean) => {
    emit('update:visible', v)
  }

  const title = computed(() => {
    return props.property ? props.property.name : ''
  })
  const useTemplateSymbol = ref(false)
  const relatedPropFullName = ref('')
  const propNameAllowed = (v: string) => {
    if (useTemplateSymbol.value) {
      return true
    } else {
      if (v.length <= 6) {
        // 只能是state或store两种输入
        return 'state.'.startsWith(v) || 'store.'.startsWith(v)
      }

      // 只允许 [state|store].xxxx(.xxx) 的形式
      return /^(state|store)[.a-zA-Z0-9_]+$/.test(v)
    }
  }

  const syncUpdate = ref(false)

  const getRelatedPropType = (fullName: string) => {
    const ns = fullName.split('.')
    if (ns.length <= 1) {
      return ''
    }
    const w = ns.shift()
    if (w === 'state') {
      let nextP = ns.shift()
      let p = currentPageSchema.value.state.find((v: Variable) => v.name === nextP)
      nextP = ns.shift()
      while (nextP) {
        p = p?.props?.find((v: Variable) => v.name === nextP)
        nextP = ns.shift()
      }
      return p?.type || ''
    } else if (w === 'store') {
      let nextP = ns.shift()
      let p = project.value?.store?.find((v: Variable) => v.name === nextP)
      nextP = ns.shift()
      while (nextP) {
        p = p?.props?.find((v: Variable) => v.name === nextP)
        nextP = ns.shift()
      }
      return p?.type || ''
    }
    return ''
  }

  // 方法 //////////////////////
  const selectedMethodId = ref('')
  const methods = computed(() => currentPageSchema.value.js.methods || [])
  const bound = computed(() => {
    const rp = currentSchema.value?.relatedProps
    return rp && rp[props.property.name]
  })

  const dialog = useDialog()
  const doConfirmBind = () => {
    if (currentSchema.value?.relatedProps) {
      currentSchema.value.relatedProps[props.property.name] = {
        name: props.property.name,
        varName: relatedPropFullName.value,
        syncUpdate: syncUpdate.value,
      }
    } else {
      currentSchema.value.relatedProps = {
        [props.property.name]: {
          name: props.property.name,
          varName: relatedPropFullName.value,
          syncUpdate: syncUpdate.value,
        },
      }
    }

    projectStore.pageDirt = true

    emit('update:visible', false)
  }
  const confirmBind = () => {
    if (props.property.type === 'function') {
      const methodId = selectedMethodId.value || Date.now().toString()
      if (!selectedMethodId.value) {
        const method = {
          id: methodId,
          name: `${props.property.name}_${currentSchema.value?.id}`,
          code: '',
          description: `${currentSchema.value?.componentName}的${props.property.name}绑定方法`,
          params: props.property.widget?.props?.params,
        }
        projectStore.addNewCustomMethod(method)
        currentMethod.value = method
      }
      // 开始绑定
      if (currentSchema.value?.relatedProps) {
        currentSchema.value.relatedProps[props.property.name] = {
          name: props.property.name,
          methodId: methodId,
        }
      } else {
        currentSchema.value.relatedProps = {
          [props.property.name]: {
            name: props.property.name,
            methodId: methodId,
          },
        }
      }
      
      // 打开方法编辑面板
      showMethodPanel.value = true
      showPluginPanel.value = true
      currentPlugin.value = Func
      return
    } else {
      if (!relatedPropFullName.value) {
        return
      }
      if (useTemplateSymbol.value) {
        // 判断所有{{}}包裹的内容是否都是以 state 或 store 开始，否则提示错误
        let all = relatedPropFullName.value.match(/\{\{(.*?)}}/g) || []
        let allValid = all.every((v: string) => {
          let vv = v.replace('{{', '').replace('}}', '')
          return vv.startsWith('state.') || vv.startsWith('store.')
        })
        if (!allValid) {
          dialog.error({
            title: '错误',
            content: '变量非法，请确认变量：必须从state/store中获取',
          })
          return
        }
      } else {
        let relatedPropType = getRelatedPropType(relatedPropFullName.value)
        let propType = props.property.type
        if (propType !== relatedPropType) {
          dialog.warning({
            title: '提示',
            content: `${props.property.name} 的类型与 ${relatedPropFullName.value} 不一致，请确认是否提交！`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              doConfirmBind()
            },
          })
          return
        }
      }
      doConfirmBind()
    }
  }

  const deleteBind = () => {
    if (currentSchema.value?.relatedProps) {
      delete currentSchema.value.relatedProps[props.property.name]
    }
    emit('update:visible', false)
  }


  onMounted(() => {
    if (props.property.type === 'function') {
      if (bound.value) {
        selectedMethodId.value = bound.value.methodId
      }
    } else {
      relatedPropFullName.value = relatedProp.value?.varName || ''
      syncUpdate.value = relatedProp.value?.syncUpdate || false
      useTemplateSymbol.value = relatedPropFullName.value.includes('{{')
    }
  })
</script>

<template>
  <n-modal :show="visible" @update:show="toggleVisible" preset="card" :title="title" style="width: 600px;"
           :bordered="false">
    <div v-if="property.type === 'function'">
      <div class="method" :class="{active: selectedMethodId === ''}" @click="selectedMethodId = ''">创建新函数</div>
      <div class="method" v-for="method in methods" :key="method.id" :class="{active: selectedMethodId === method.id}"
           @click="selectedMethodId = method.id">{{ method.name }}
      </div>
    </div>
    <div v-else>
      <div class="text-12px">
        规则：只能是state或store下创建的变量，以点分割，如：state.name 或 store.name.age
      </div>
      <div class="flex">
        <n-checkbox v-model:checked="useTemplateSymbol">使用模板语法</n-checkbox>
        <n-checkbox v-model:checked="syncUpdate">同步更新</n-checkbox>
      </div>
      <div class="flex items-center">
        <n-input type="text" v-model:value="relatedPropFullName" :allow-input="propNameAllowed" />
      </div>
      <n-divider />
      <div class="flex">
        <div class="flex-1">
          <div class="text-center">State 页面变量</div>
          <n-grid :x-gap="8" :y-gap="8" :cols="3">
            <n-grid-item v-for="variable in stateList">
              <n-tooltip placement="bottom">
                <template #trigger>
                  <n-tag @click="relatedPropFullName=(`state.${variable.name}`)">{{ variable.name }}</n-tag>
                </template>
                <div>
                  <template v-if="variable.type === 'object'">
                    <div>{</div>
                    <template v-for="prop in variable.props" :key="prop.name">
                      <div>{{ prop.name }}: {{ prop.type }}</div>
                    </template>
                    <div>}</div>
                  </template>
                  <template v-else-if="variable.type === 'string'">
                    <div>{{ variable.type }} : "{{ variable.defaultValue }}"</div>
                  </template>
                  <template v-else-if="variable.type === 'number' || variable.type === 'boolean'">
                    <div>{{ variable.type }} : {{ variable.defaultValue }}</div>
                  </template>
                  <template v-else-if="variable.type === 'array'">
                    <div>{{ variable.type }} : []</div>
                  </template>
                  <template v-else>
                    <div>{{ variable.type }} : {{ variable.defaultValue }}</div>
                  </template>
                </div>
              </n-tooltip>
            </n-grid-item>
          </n-grid>
        </div>
        <div style="border:1px solid #EEEEEE;" class="mx-32px"></div>
        <div class="flex-1">
          <div class="text-center">Store 全局变量</div>
          <n-grid :x-gap="8" :y-gap="8" :cols="3">
            <n-grid-item v-for="variable in storeList">
              <n-tooltip>
                <template #trigger>
                  <n-tag @click="relatedPropFullName=(`store.${variable.name}`)">{{ variable.name }}</n-tag>
                </template>
                <div>
                  <template v-if="variable.type === 'object'">
                    <div>{</div>
                    <template v-for="prop in variable.props" :key="prop.name">
                      <div>{{ prop.name }}: {{ prop.type }}</div>
                    </template>
                    <div>}</div>
                  </template>
                  <template v-else-if="variable.type === 'string'">
                    <div>{{ variable.type }} : "{{ variable.defaultValue }}"</div>
                  </template>
                  <template v-else-if="variable.type === 'number' || variable.type === 'boolean'">
                    <div>{{ variable.type }} : {{ variable.defaultValue }}</div>
                  </template>
                  <template v-else-if="variable.type === 'array'">
                    <div>{{ variable.type }} : []</div>
                  </template>
                  <template v-else>
                    <div>{{ variable.type }} : {{ variable.defaultValue }}</div>
                  </template>
                </div>
              </n-tooltip>
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <div>
          <n-button type="error" v-if="relatedProp" @click="deleteBind">删除绑定</n-button>
        </div>
        <div class="flex">
          <n-button class="mr-8px" @click="emit('update:visible', false)">取消</n-button>
          <n-button type="primary" @click="confirmBind">确定</n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
  .method {
    padding: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    transition: background .2s;

    &:hover, &.active {
      background: #18A058;
      color: #fff;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
</style>