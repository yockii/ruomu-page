<script setup lang="ts">


  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { NCollapseTransition, NForm, NFormItem, NIcon, NSlider, NInputNumber, NSelect } from 'naive-ui'
  import type { SelectOption, SelectGroupOption } from 'naive-ui'
  import { changeStyle } from '../util'

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  const expanded = ref(true)

  const styleValue = computed(() => (styleName: string) => projectStore.styleValue(selectState.value.id, styleName))
  const numberedStyleValue = computed(() => (styleName: string) => Number(styleValue.value(styleName)))
  
  const opacity = computed(() => numberedStyleValue.value('opacity') || 1)
  
  const changeOpacity = (v: number | null ) => {
    changeStyle('opacity', v ? v + '':null)
  }
  
  
  const cursorOptions: Array<SelectOption | SelectGroupOption> = [
    {
      type: 'group',
      label: '基本',
      children: [
        {label:'自动', value: 'auto', style: 'cursor: auto'},
        {label:'默认', value: 'default', style: 'cursor: default'},
        {label:'无指针', value: 'none', style: 'cursor: none'},
      ]
    },
    {
      type: 'group',
      label: '链接/状态',
      children: [
        {label:'内容目录', value: 'context-menu', style: 'cursor: context-menu'},
        {label:'帮助', value: 'help', style: 'cursor: help'},
        {label:'指针', value: 'pointer', style: 'cursor: pointer'},
        {label:'进度', value: 'progress', style: 'cursor: progress'},
        {label:'等待', value: 'wait', style: 'cursor: wait'},
      ]
    },
    {
      type: 'group',
      label: '选择',
      children: [
        {label:'十字', value: 'crosshair', style: 'cursor: crosshair'},
        {label:'文本', value: 'text', style: 'cursor: text'},
        {label:'垂直文本', value: 'vertical-text', style: 'cursor: vertical-text'},
        {label:'单元格', value: 'cell', style: 'cursor: cell'},
      ]
    },
    {
      type: 'group',
      label: '拖拽',
      children: [
        {label:'快捷方式', value: 'alias', style: 'cursor: alias'},
        {label:'复制', value: 'copy', style: 'cursor: copy'},
        {label:'移动', value: 'move', style: 'cursor: move'},
        {label:'禁止drop', value: 'no-drop', style: 'cursor: no-drop'},
        {label:'禁止', value: 'not-allowed', style: 'cursor: not-allowed'},
        {label:'可抓取', value: 'grab', style: 'cursor: grab'},
        {label:'抓取中', value: 'grabbing', style: 'cursor: grabbing'},
      ]
    },
    {
      type: 'group',
      label: '调整',
      children: [
        {label:'任意', value: 'all-scroll', style: 'cursor: all-scroll'},
        {label:'宽度设置', value: 'col-resize', style: 'cursor: col-resize'},
        {label:'高度设置', value: 'row-resize', style: 'cursor: row-resize'},
        {label:'向上调整', value: 'n-resize', style: 'cursor: n-resize'},
        {label:'向右调整', value: 'e-resize', style: 'cursor: e-resize'},
        {label:'向下调整', value: 's-resize', style: 'cursor: s-resize'},
        {label:'向左调整', value: 'w-resize', style: 'cursor: w-resize'},
        {label:'右上调整', value: 'ne-resize', style: 'cursor: ne-resize'},
        {label:'右下调整', value: 'se-resize', style: 'cursor: se-resize'},
        {label:'左下调整', value: 'sw-resize', style: 'cursor: sw-resize'},
        {label:'左上调整', value: 'nw-resize', style: 'cursor: nw-resize'},
        {label:'水平调整', value: 'ew-resize', style: 'cursor: ew-resize'},
        {label:'垂直调整', value: 'ns-resize', style: 'cursor: ns-resize'},
        {label:'左上右下调整', value: 'nwse-resize', style: 'cursor: nwse-resize'},
        {label:'右上左下调整', value: 'nesw-resize', style: 'cursor: nesw-resize'},
      ]
    },
    {
      type: 'group',
      label: '缩放',
      children: [
        {label:'缩小', value: 'zoom-out', style: 'cursor: zoom-out'},
        {label:'放大', value: 'zoom-in', style: 'cursor: zoom-in'},
      ]
    }
  ]
</script>

<template>

  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="expanded = !expanded">
    <span>效果</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>

  <n-collapse-transition :show="expanded">
    <n-form size="small" label-placement="left" class="mt-8px">
      <n-form-item label="透明度">
        <n-slider :value="opacity" :min="0" :max="1" :step="0.01"  @update:value="changeOpacity"/>
        <n-input-number :value="opacity" :min="0" :max="1" :step="0.01" @update:value="changeOpacity" @clear="changeOpacity(null)" clearable :show-button="false"/>
      </n-form-item>
      <n-form-item label="鼠标样式">
        <n-select :value="styleValue('cursor')" @update:value="v => changeStyle('cursor', v)" :options="cursorOptions" />
      </n-form-item>
    </n-form>
  </n-collapse-transition>
  
</template>

<style scoped>

</style>