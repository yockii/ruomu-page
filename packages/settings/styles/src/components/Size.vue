<script setup lang="ts">
  import { NCollapseTransition, NIcon, NInputNumber, NDropdown, NForm, NGrid, NFormItemGi } from 'naive-ui'
  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { computed, ref } from 'vue'
  import { changeStyle } from '../util'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const digitReg = /\d+/
  const unitReg = /[a-zA-Z%]+/i

  const expanded = ref(true)


  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)
  
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
    const v = projectStore.styleValue(selectState.value.id, styleName)
    return splitDigitUnit(v)
  })
  
  const width = computed(() => {
    return splitValue.value('width')
  })
  const minWidth = computed(() => {
    return splitValue.value('minWidth')
  })
  const maxWidth = computed(() => {
    return splitValue.value('maxWidth')
  })

  const height = computed(() => {
    return splitValue.value('height')
  })
  const minHeight = computed(() => {
    return splitValue.value('minHeight')
  })
  const maxHeight = computed(() => {
    return splitValue.value('maxHeight')
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
    <span>尺寸</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>

  <n-collapse-transition :show="expanded">
    <n-form size="small" label-placement="left" class="mt-8px">
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="宽度">
          <n-input-number :value="width.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('width', v)" >
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('width', k)">
                <span class="cursor-pointer">{{ width.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="高度">
          <n-input-number :value="height.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('height', v)" >
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('height', k)">
                <span class="cursor-pointer">{{ height.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="最小宽度">
          <n-input-number :value="minWidth.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('minWidth', v)" :show-button="false">
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('minWidth', k)">
                <span class="cursor-pointer">{{ minWidth.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="最小高度">
          <n-input-number :value="minHeight.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('minHeight', v)" :show-button="false">
            <template #suffix>
              <n-dropdown trigger="click" :options="[
                {label: 'px', key: 'px'},
                {label: '%', key: '%'},
                {label: 'rem', key: 'rem'},
                {label: 'em', key: 'em'}
              ]" @select="k => changeStyleUnit('minHeight', k)">
                <span class="cursor-pointer">{{ minHeight.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="最大宽度">
          <n-input-number :value="maxWidth.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('maxWidth', v)" :show-button="false">
            <template #suffix>
              <n-dropdown trigger="click" :options="[
              {label: 'px', key: 'px'},
              {label: '%', key: '%'},
              {label: 'rem', key: 'rem'},
              {label: 'em', key: 'em'}
            ]" @select="k => changeStyleUnit('maxWidth', k)">
                <span class="cursor-pointer">{{ maxWidth.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="最大高度">
          <n-input-number :value="maxHeight.digit" size="small" min="0" step="1" @update:value="v => changeStyleDigit('maxHeight', v)" :show-button="false">
            <template #suffix>
              <n-dropdown trigger="click" :options="[
              {label: 'px', key: 'px'},
              {label: '%', key: '%'},
              {label: 'rem', key: 'rem'},
              {label: 'em', key: 'em'}
            ]" @select="k => changeStyleUnit('maxHeight', k)">
                <span class="cursor-pointer">{{ maxHeight.unit }}</span>
              </n-dropdown>
            </template>
          </n-input-number>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-collapse-transition>
</template>

<style scoped>

</style>