<script setup lang="ts">
  import { NModal, NH1, NTag, NButton } from 'naive-ui'
  import { computed, PropType, h, ref } from 'vue'
  import { Event, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object as PropType<Event>,
      required: true
    }
  })
  const emit = defineEmits(['update:visible'])
  
  const projectStore = useProjectStore()
  const { currentPageSchema } = storeToRefs(projectStore)
  
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
  const selectedMethod = ref('')
  const confirm = () => {
    if (selectedMethod.value) {
    } else {
    }
  }
</script>

<template>
  <n-modal :show="visible" @update:show="emit('update:visible', $event)" preset="card" :title="title" style="width: 600px;" :bordered="false">
    <div class="flex">
      <div class="flex-1">
        <div class="method" :class="{active: selectedMethod === ''}" @click="selectedMethod = ''">创建新函数</div>
        <div class="method" v-for="method in methods" :key="method.id" :class="{active: selectedMethod === method.id}" @click="selectedMethod = method.id">{{method.name}}</div>
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
    background: #e0e0e0;
  }
  &:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>