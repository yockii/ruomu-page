<script setup lang="ts">
  import {NPopover, NButton, NSlider, NInputNumber, NSelect} from 'naive-ui'
  import { ref } from 'vue'
  import { changeStyle } from '../../../util'
  
  const props = defineProps({
    styleName: {
      type: String,
      required: true
    },
    defaultValue: {
      type: String,
      default: '0px'
    }
  })
  
  const showPopover = ref(false)
  const d = ref(0)
  const u = ref('px')
  
  const edit = () => {
    const digitReg = /\d+/
    const unitReg = /[a-zA-Z%]+/i;
    const digit = props.defaultValue.match(digitReg)
    const unit = props.defaultValue.match(unitReg)
    d.value = digit ? Number(digit[0]) : 0
    u.value = unit ? unit[0] : 'px'

    showPopover.value = true
  }

  const doChange = () => {
    changeStyle(props.styleName, `${d.value}${u.value}`)
    showPopover.value = false
  }  
  
</script>

<template>
  <n-popover trigger="click" :show="showPopover" >
    <template #trigger>
      <n-button quaternary @click="edit">{{ defaultValue }}</n-button>
    </template>
    <div class="w-100%">
      <n-slider v-model:value="d" />
      <div class="flex mt-4px">
        <div class="flex-1">
          <n-input-number v-model:value="d" />
        </div>
        <div class="w-80px ml-4px">
          <n-select v-model:value="u" :options="[
                { label: 'px', value: 'px' },
                { label: '%', value: '%' },
                { label: 'rem', value: 'rem' },
                { label: 'em', value: 'em' }
              ]" />
        </div>
      </div>
      <div class="w-100% mt-8px flex justify-end">
        <n-button type="primary" @click="doChange">确定</n-button>
        <n-button class="ml-4px" @click="showPopover = false">取消</n-button>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>

</style>