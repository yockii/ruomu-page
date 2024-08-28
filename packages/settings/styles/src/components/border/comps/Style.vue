<script setup lang="ts">
  import {NButton, NDropdown} from 'naive-ui'
  import { computed } from 'vue'
  import { changeStyle } from '../../../util'

  const props = defineProps({
    styleName: {
      type: String,
      required: true
    },
    defaultValue: {
      type: String,
      default: 'none'
    }
  })

  const handleSelect = (value: string) => {
    changeStyle(props.styleName, value)
  }
  
  const options = [
    {
      label: ' 无边框',
      key: 'none'
    },
    {
      label: '实线',
      key: 'solid'
    },
    {
      label: '虚线',
      key: 'dashed'
    },
    {
      label: '点线',
      key: 'dotted'
    },
    {
      label: '双线',
      key: 'double'
    },
    {
      label: '3D凹槽',
      key: 'groove'
    },
    {
      label: '3D凸槽',
      key: 'ridge'
    },
    {
      label: '3D内嵌',
      key: 'inset'
    },
    {
      label: '3D外凸',
      key: 'outset'
    }
  ]

  const display = computed(() => {
    return options.find(option => option.key === props.defaultValue)?.label
  })
</script>

<template>
  <n-dropdown trigger="click" :options="options" @select="handleSelect">
    <n-button quaternary>{{display}}</n-button>
  </n-dropdown>
</template>
