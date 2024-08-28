<script setup lang="ts">

  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { NCollapseTransition, NDivider, NDropdown, NColorPicker, NSwitch, NSelect, NForm, NFormItem, NFormItemGi, NGrid, NIcon, NInputNumber, NInput } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import { changeStyle } from '../util'

  const digitReg = /\d+/
  const unitReg = /[a-zA-Z%]+/i

  const expanded = ref(true)


  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)

  const styleValue = computed(() => (styleName: string) => projectStore.styleValue(selectState.value.id, styleName))

  const splitDigitUnit = (v:string):{digit:number|null, unit: string} => {
    if (v) {
      const digit = v.match(digitReg)
      const unit = v.match(unitReg)

      return {
        digit: digit ? Number(digit[0]) : 0,
        unit: unit ? unit[0] : 'px',
      }
    } else {
      return {
        digit: null,
        unit: 'px',
      }
    }
  }


  const splitValue = computed(() => (styleName: string) => {
    const v = styleValue.value(styleName)
    return splitDigitUnit(v)
  })
  
  const styleValueArray = computed(() => (styleName: string) => {
    const v = styleValue.value(styleName)
    return v?.split(' ') || []
  })

  const changeStyleDigit = (styleName: string, digit: number | null) => {
    if (digit) {
      const {unit} = splitValue.value(styleName)
      changeStyle(styleName, `${digit}${unit}`)
    } else {
      changeStyle(styleName, null)
    }
  }

  const changeStyleUnit = (styleName: string, unit: string) => {
    const {digit} = splitValue.value(styleName)
    changeStyle(styleName, `${digit}${unit}`)
  }
  
</script>

<template>

  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="expanded = !expanded">
    <span>文字</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>

  <n-collapse-transition :show="expanded">
    <n-form size="small" label-placement="left" class="mt-8px">
      <n-divider>字</n-divider>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="字号">
          <n-input-number :value="splitValue('fontSize').digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('fontSize', v)" >
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('fontSize', k)">
                <span class="cursor-pointer">{{ splitValue('fontSize').unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="字体">
          <n-input :value="styleValue('fontFamily')" size="small" min="0" step="1" @update:value="v => changeStyle('fontFamily', v as string)" />
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="行高">
          <n-input-number :value="splitValue('lineHeight').digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('lineHeight', v)" :show-button="false">
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('lineHeight', k)">
                <span class="cursor-pointer">{{ splitValue('lineHeight').unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="字重">
          <n-select :value="splitValue('fontWeight').digit" size="small" clearable :options="[
            {label: '继承(默认)', value: 'inherit'},
            {label: '100', value: '100'},
            {label: '200', value: '200'},
            {label: '300', value: '300'},
            {label: '400', value: '400'},
            {label: '500', value: '500'},
            {label: '600', value: '600'},
            {label: '700', value: '700'},
            {label: '800', value: '800'},
            {label: '900', value: '900'},
          ]" @update:value="v => changeStyle('fontWeight', v)" :show-button="false" />
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="颜色">
          <n-color-picker :value="styleValue('color')" @confirm="v => changeStyle('color', v)"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="对齐">
          <n-select :value="styleValue('textAlign')" :options="[
            {label: '继承(默认)', value: 'inherit'},
            {label: '左对齐', value: 'left'},
            {label: '居中', value: 'center'},
            {label: '右对齐', value: 'right'},
            {label: '两端对齐', value: 'justify'}
          ]" size="small" @update:value="v => changeStyle('textAlign', v as string)" />
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="斜体">
          <n-switch :value="styleValue('fontStyle') === 'italic'" size="small" @update:value="v => changeStyle('fontStyle', v ? 'italic' : 'normal')" />
        </n-form-item-gi>
      </n-grid>
      <n-divider>线</n-divider>
      <n-form-item label="颜色">
        <n-color-picker :value="styleValue('textDecorationColor')" @confirm="v => changeStyle('textDecorationColor', v)"/>
      </n-form-item>
      <n-form-item label="位置">
        <n-select :value="styleValueArray('textDecorationLine')" multiple clearable :options="[
          {label: '无', value: 'none'},
          {label: '继承', value: 'inherit'},
          {label: '不设置', value: 'unset'},
          {label: '上划线', value: 'overline'},
          {label: '中划线', value: 'line-through'},
          {label: '下划线', value: 'underline'},
        ]" size="small" @update:value="v => changeStyle('textDecorationLine', (v as string[]).join(' '))" />
      </n-form-item>
      <n-form-item label="样式">
        <n-select :value="styleValue('textDecorationStyle')" clearable :options="[
          {label: '不设置', value: 'unset'},
          {label: '继承', value: 'inherit'},
          {label: '实线', value: 'solid'},
          {label: '双线', value: 'double'},
          {label: '点线', value: 'dotted'},
          {label: '虚线', value: 'dashed'},
          {label: '波浪线', value: 'wavy'},
        ]" size="small" @update:value="v => changeStyle('textDecorationStyle', v as string)" />
      </n-form-item>
    </n-form>
  </n-collapse-transition>
  
</template>

<style scoped>
  .n-divider:not(.n-divider--vertical) {
    margin-top: 4px;
    margin-bottom: 8px;
    font-size: 12px;
  }
</style>