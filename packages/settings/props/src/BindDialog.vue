<script setup lang="ts">
  import type { Property } from '@ruomu-ui/types'
  import { ref, computed, PropType, onMounted } from 'vue'
  import { NModal, NInput, NDivider, NButton, NCheckbox, NGrid, NGridItem, NTag, NTooltip } from 'naive-ui'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    property: {
      type: Object as PropType<Property>,
      required: true
    }
  })
  const emit = defineEmits(['update:visible'])


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

  const toggleVisible = (v:boolean) => {
    emit('update:visible', v)
  }
  
  const title = computed(() => {
    return props.property ? props.property.name : ''
  })
  
  const relatedPropFullName = ref('')
  const propNameAllowed = (v : string) => {
    if (v.length <= 6) {
      // 只能是state或store两种输入
      return 'state.'.startsWith(v) || 'store.'.startsWith(v)
    }
    
    // 只允许 [state|store].xxxx(.xxx) 的形式
    return /^(state|store)[.a-zA-Z0-9_]+$/.test(v)
  }
  
  const syncUpdate = ref(false)
  
  const confirmBind = () => {
    if (!relatedPropFullName.value) {
      return
    }
    if (currentSchema.value?.relatedProps) {
      currentSchema.value.relatedProps[props.property.name] = {
        name: props.property.name,
        varName: relatedPropFullName.value,
        syncUpdate: syncUpdate.value
      }
    } else {
      currentSchema.value.relatedProps = {
        [props.property.name]: {
          name: props.property.name,
          varName: relatedPropFullName.value,
          syncUpdate: syncUpdate.value
        }
      }
    }
    
    emit('update:visible', false)
  }
  
  const deleteBind = () => {
    if (currentSchema.value?.relatedProps) {
      delete currentSchema.value.relatedProps[props.property.name]
    }
    emit('update:visible', false)
  }
  
  
  onMounted(() => {
    relatedPropFullName.value = relatedProp.value?.varName || ''
    syncUpdate.value = relatedProp.value?.syncUpdate || false
  })
</script>

<template>
  <n-modal :show="visible" @update:show="toggleVisible" preset="card" :title="title" style="width: 600px;" :bordered="false">
    <div class="text-12px">
      规则：只能是state或store下创建的变量，以点分割，如：state.name 或 store.name.age
    </div>
    <div class="flex items-center">
      <n-input type="text" v-model:value="relatedPropFullName" :allow-input="propNameAllowed"/>
      <div class="ml-8px w-120px">
        <n-checkbox v-model:checked="syncUpdate">同步更新</n-checkbox>
      </div>
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
                  <div>{{ variable.type }} : "{{ variable.defaultValue}}"</div>
                </template>
                <template v-else-if="variable.type === 'number' || variable.type === 'boolean'">
                  <div>{{ variable.type }} : {{ variable.defaultValue}}</div>
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
      <n-divider vertical />
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
                  <div>{{ variable.type }} : "{{ variable.defaultValue}}"</div>
                </template>
                <template v-else-if="variable.type === 'number' || variable.type === 'boolean'">
                  <div>{{ variable.type }} : {{ variable.defaultValue}}</div>
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

<style scoped>

</style>