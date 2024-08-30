<script setup lang="ts">
  import { NModal, NH1, NTag, NButton } from 'naive-ui'
  import { computed, PropType, h, ref, onMounted, watch } from 'vue'
  import { BindEventInfo, Event, useCanvasStore, useLayoutStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import Func, { usePluginFunctionStore } from '@ruomu-ui/plugin-function'
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object as PropType<Event | undefined>,
      default: undefined
    }
  })
  const emit = defineEmits(['update:visible'])
  
  const toggleVisible = (v:boolean) => {
    emit('update:visible', v)
  }
  
  const projectStore = useProjectStore()
  const { currentPageSchema } = storeToRefs(projectStore)
  const canvasStore = useCanvasStore()
  const { selectState } = storeToRefs(canvasStore)
  const pluginFunctionStore = usePluginFunctionStore()
  const {currentMethod, showMethodPanel} = storeToRefs(pluginFunctionStore)
  const layoutStore = useLayoutStore()
  const {currentPlugin, showPluginPanel} = storeToRefs(layoutStore)
  
  const currentSchema = computed(() => projectStore.findSchemaSegment(selectState.value.id))
  
  const bound = computed(() => currentSchema.value?.events?.find((e:BindEventInfo) => e.eventName === props.event?.name))
  
  const title = () => {
    const tags = []
    for(let i = 0; i < props.event.params.length; i++) {
      tags.push(h(NTag, {
        type: 'info',
        size: 'small',
      }, props.event.params[i].name))
    }
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      },
      [
        h(NH1, {}, props.event?.label || ''),
        h('div', {
          style: {
            display: 'flex',
            gap: '4px'
          }
        }, tags)
      ],
    )
  }
  
  const methods = computed(() => currentPageSchema.value.js.methods || [] )
  const selectedMethodId = ref('')
  const confirm = () => {
    const methodId = selectedMethodId.value || Date.now().toString()
    if (!selectedMethodId.value) {
      const method = {
        id: methodId,
        name: `${props.event.name}_${currentSchema.value?.id}`,
        code: '',
        description: `${currentSchema.value?.componentName}的${props.event.description}`,
        params: props.event.params,
      }
      projectStore.addNewCustomMethod(method)
      currentMethod.value = method
      showMethodPanel.value = true
      showPluginPanel.value = true
      currentPlugin.value = Func
    }
    
    // 开始绑定
    const bindInfo = {
      eventName: props.event?.name,
      methodId: methodId
    }
    const currentEvents = currentSchema.value?.events
    if (currentEvents) {
      if (currentEvents.find((item:BindEventInfo) => item.eventName === props.event.name)) {
        currentEvents.forEach((item:BindEventInfo) => {
          if (item.eventName === props.event.name) {
            item.methodId = methodId
          }
        })
      } else {
        currentEvents.push(bindInfo)
      }
    } else {
      currentSchema.value.events = [bindInfo]
    }
    
    emit('update:visible', false)
  }
    
  onMounted(() => {
    if (bound.value) {
      selectedMethodId.value = bound.value.methodId
    }
  })
</script>

<template>
  <n-modal :show="visible" @update:show="toggleVisible" preset="card" :title="title" style="width: 600px;" :bordered="false">
    <div class="flex">
      <div class="flex-1">
        <div class="method" :class="{active: selectedMethodId === ''}" @click="selectedMethodId = ''">创建新函数</div>
        <div class="method" v-for="method in methods" :key="method.id" :class="{active: selectedMethodId === method.id}" @click="selectedMethodId = method.id">{{method.name}}</div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <n-button type="primary" @click="confirm">确定</n-button>
        <n-button text class="ml-8px" @click="emit('update:visible', false)">取消</n-button>
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