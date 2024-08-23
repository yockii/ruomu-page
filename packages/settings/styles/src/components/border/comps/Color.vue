<script setup lang="ts">
  import {NPopover, NColorPicker, NButton} from 'naive-ui'
  import { ref } from 'vue'
  import { changeStyle } from '../../../util'
  const props = defineProps({
    styleName: {
      type: String,
      required: true
    },
    defaultValue: {
      type: String,
      default: '#00000000'
    }
  })
  
  const v = ref('#00000000')
  const doChange = () => {
    changeStyle(props.styleName, v.value)
    showPopover.value = false
  }

  const showPopover = ref(false)


  const edit = () => {
    v.value = props.defaultValue
    showPopover.value = true
  }
</script>

<template>
  <n-popover trigger="click" :show="showPopover">
    <template #trigger>
      <n-button size="small" :color="defaultValue" @click="edit"></n-button>
    </template>
    <div class="w-200px">
      <n-color-picker
        v-model:value="v"
        :actions="['confirm', 'clear']"
      />
      <div class="w-100% mt-8px flex justify-end">
        <n-button type="primary" @click="doChange">确定</n-button>
        <n-button class="ml-4px" @click="showPopover = false">取消</n-button>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>

</style>