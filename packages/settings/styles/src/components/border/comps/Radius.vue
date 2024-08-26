<script lang="ts" setup>
  import {NPopover, NButton, NSlider, NInputNumber, NSelect} from 'naive-ui'
  import { ref, PropType } from 'vue'
  import { changeStyle } from '../../../util'
  
  type Position = 'tl' | 'tr' | 'bl' | 'br'
  const props = defineProps({
    styleName: {
      type: String,
      required: true
    },
    defaultValue: {
      type: String,
      default: '0px'
    },
    position: {
      type: String as PropType<Position>,
      default: 'tl'
    },
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
  <n-popover :show="showPopover" trigger="click" >
    <template #trigger>
      <div :class="position" class="b-r" @click="edit">
        <span :class="position">{{ defaultValue }}</span>
      </div>
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
.b-r {
  --bg-color:  #CCC;
  --text-space: 4px;
  position: absolute;
  cursor: pointer;
  width: var(--outer-border);
  height:  var(--outer-border);
  opacity: 0.3;
  
  &:hover {
    opacity: 1;
  }

  &.tl {
    top: 0;
    left: 0;
    background: linear-gradient(135deg, var(--bg-color), var(--bg-color) 50%, transparent 50%, transparent 100%);

    &:hover {
      background: linear-gradient(135deg, #EEE, #EEE 50%, transparent 50%, transparent 100%);
    }
  }

  &.bl {
    bottom: 0;
    left: 0;
    background: linear-gradient(45deg, var(--bg-color), var(--bg-color) 50%, transparent 50%, transparent 100%);

    &:hover {
      background: linear-gradient(45deg, #EEE, #EEE 50%, transparent 50%, transparent 100%);
    }
  }

  &.tr {
    top: 0;
    right: 0;
    background: linear-gradient(-135deg, var(--bg-color), var(--bg-color) 50%, transparent 50%, transparent 100%);

    &:hover {
      background: linear-gradient(-135deg, #EEE, #EEE 50%, transparent 50%, transparent 100%);
    }
  }

  &.br {
    bottom: 0;
    right: 0;
    background: linear-gradient(-45deg, var(--bg-color), var(--bg-color) 50%, transparent 50%, transparent 100%);

    &:hover {
      background: linear-gradient(-45deg, #EEE, #EEE 50%, transparent 50%, transparent 100%);
    }
  }
  
  .tl {
    position: absolute;
    top: var(--text-space);
    left: calc(var(--text-space) * 2);
  }
  .tr {
    position: absolute;
    top: var(--text-space);
    right: calc(var(--text-space) * 2);
  }
  .bl {
    position: absolute;
    bottom: var(--text-space);
    left: calc(var(--text-space) * 2);
  }
  .br {
    position: absolute;
    bottom: var(--text-space);
    right: calc(var(--text-space) * 2);
  }
}
</style>