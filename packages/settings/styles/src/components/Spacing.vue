<script setup lang="ts">
  import { NCollapseTransition, NIcon, NInputNumber, NInput, NButton, NButtonGroup, NSelect } from 'naive-ui'
  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { computed, ref } from 'vue'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import {reSelectNode,    changeStyle} from "../util"
  
  const expanded = ref(true)

  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)



  const margin = computed(() => {
    const r = {
      top: projectStore.styleValue(selectState.value.id, "marginTop"),
      bottom: projectStore.styleValue(selectState.value.id, "marginBottom"),
      left: projectStore.styleValue(selectState.value.id, "marginLeft"),
      right: projectStore.styleValue(selectState.value.id, "marginRight"),
    }
    
    const m = projectStore.styleValue(selectState.value.id, "margin")
    if (m) {
      const ms = m.split(" ")
      if (ms.length === 1) {
        return {
          top: r.top || ms[0],
          bottom: r.bottom ||ms[0],
          left: r.left || ms[0],
          right: r.right || ms[0],
        }
      } else if (ms.length === 2) {
        return {
          top: r.top || ms[0],
          bottom: r.bottom ||ms[0],
          left: r.left || ms[1],
          right: r.right || ms[1],
        }
      } else if (ms.length === 3) {
        return {
          top: r.top || ms[0],
          bottom: r.bottom ||ms[2],
          left: r.left || ms[1],
          right: r.right || ms[1],
        }
      } else {
        return {
          top: r.top || ms[0],
          bottom: r.bottom ||ms[2],
          left: r.left || ms[3],
          right: r.right || ms[1],
        }
      }
    }
    
    return {
      top: r.top || "0",
      bottom: r.bottom || "0",
      left: r.left || "0",
      right: r.right || "0",
    }
  })
  
  const padding = computed(() => {
    const r = {
      top: projectStore.styleValue(selectState.value.id, "paddingTop") ,
      bottom: projectStore.styleValue(selectState.value.id, "paddingBottom") ,
      left: projectStore.styleValue(selectState.value.id, "paddingLeft") ,
      right: projectStore.styleValue(selectState.value.id, "paddingRight"),
    }
    const p = projectStore.styleValue(selectState.value.id, "padding")
    if (p) {
      const ps = p.split(" ")
      if (ps.length === 1) {
        return {
          top: r.top || ps[0],
          bottom: r.bottom || ps[0],
          left: r.left || ps[0],
          right: r.right || ps[0]
        }
      } else if (ps.length === 2) {
        return {
          top: r.top || ps[0],
          bottom: r.bottom || ps[0],
          left: r.left || ps[1],
          right: r.right || ps[1]
        }
      } else if (ps.length === 3) {
        return {
          top: r.top || ps[0],
          bottom: r.bottom || ps[2],
          left: r.left || ps[1],
          right: r.right || ps[1]
        }
      } else {
        return {
          top: r.top || ps[0],
          bottom: r.bottom || ps[2],
          left: r.left || ps[3],
          right: r.right || ps[1]
        }
      }
    }
    
    return {
      top: r.top || "0",
      bottom: r.bottom || "0",
      left: r.left || "0",
      right: r.right || "0"
    }
  })

  // 编辑
  const currentStyleName = ref('')
  const currentValueDigit = ref(0)
  const currentValueUnit = ref('px')
  const openDialog = ref(false)
  const openChangeDialog = (styleName: string, value: string) => {
    currentStyleName.value = styleName
    const digitReg = /\d+/
    const unitReg = /[a-zA-Z%]+/i;
    const digit = value.match(digitReg)
    const unit = value.match(unitReg)
    if (digit) {
      currentValueDigit.value = Number(digit[0])
    }
    if (unit) {
      currentValueUnit.value = unit[0]
    }
    openDialog.value = true
  }
  
  const changeStyleValue = (v: number, u: string) => {
    currentValueDigit.value = v
    currentValueUnit.value = u
  }
  const doChange = () => {
    changeStyle(currentStyleName.value, currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`)
    openDialog.value = false
  }
  const doChangeForAll = () => {
    if (currentStyleName.value.startsWith('margin')) {
      changeStyle('marginTop', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('marginBottom', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('marginLeft', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('marginRight', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
    } else {
      changeStyle('paddingTop', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('paddingBottom', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('paddingLeft', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
      changeStyle('paddingRight', currentValueUnit.value === 'auto'?'auto':`${currentValueDigit.value}${currentValueUnit.value}`, ()=>{})
    }
    openDialog.value = false

    reSelectNode()
  }
</script>

<template>
  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="expanded = !expanded">
    <span>间距</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>

  <n-collapse-transition :show="expanded">
    <div class="m-4px flex justify-center">
      <div v-if="!openDialog" class="margin-rect">
        <div class="tag">margin</div>
        
        <div class="top" @click="openChangeDialog('marginTop', margin.top)"></div>
        <div class="bottom" @click="openChangeDialog('marginBottom', margin.bottom)"></div>
        <div class="left" @click="openChangeDialog('marginLeft', margin.left)"></div>
        <div class="right" @click="openChangeDialog('marginRight', margin.right)"></div>
  
        <div class="v t">{{ margin.top }}</div>
        <div class="v b">{{ margin.bottom }}</div>
        <div class="v l">{{ margin.left }}</div>
        <div class="v r">{{ margin.right }}</div>
        
        <div class="padding-area">
          <div class="padding-rect">
            <div class="tag">padding</div>

            <div class="top" @click="openChangeDialog('paddingTop', padding.top)"></div>
            <div class="bottom" @click="openChangeDialog('paddingBottom', padding.bottom)"></div>
            <div class="left" @click="openChangeDialog('paddingLeft', padding.left)"></div>
            <div class="right" @click="openChangeDialog('paddingRight', padding.right)"></div>

            <div class="v t">{{ padding.top }}</div>
            <div class="v b">{{ padding.bottom }}</div>
            <div class="v l">{{ padding.left }}</div>
            <div class="v r">{{ padding.right }}</div>
          </div>
        </div>
      </div>
      
      <div class="w-100%" v-if="openDialog">
        <div class="flex justify-start items-center">
          <div class="mr-4px">{{currentStyleName}}:</div>
          <div class="flex-1">
            <n-input v-if="currentValueUnit==='auto'" size="small" v-model:value="currentValueUnit" />
            <n-input-number v-else size="small" v-model:value="currentValueDigit" :step="1" :min="0" />
          </div>
          <div class="w-80px ml-4px">
            <n-select size="small" v-model:value="currentValueUnit" :options="[
              { label: 'px', value: 'px' },
              { label: '%', value: '%' },
              { label: 'rem', value: 'rem' },
              { label: 'em', value: 'em' }
            ]" />
          </div>
        </div>
        <!-- 快捷选择 -->
        <div class="flex flex-wrap">
          <div class="quick-select" @click="changeStyleValue(0, 'auto')" :class="{ active: currentValueDigit === 0 && currentValueUnit === 'auto' }">auto</div>
          <div class="quick-select" @click="changeStyleValue(0, '')" :class="{ active: currentValueDigit === 0 && currentValueUnit !== 'auto'}">0</div>
          <div class="quick-select" @click="changeStyleValue(4, 'px')" :class="{ active: currentValueDigit === 4 && currentValueUnit === 'px'}">4px</div>
          <div class="quick-select" @click="changeStyleValue(8, 'px')" :class="{ active: currentValueDigit === 8 && currentValueUnit === 'px'}">8px</div>
          <div class="quick-select" @click="changeStyleValue(16, 'px')" :class="{ active: currentValueDigit === 16 && currentValueUnit === 'px'}">16px</div>
          <div class="quick-select" @click="changeStyleValue(24, 'px')" :class="{ active: currentValueDigit === 24 && currentValueUnit === 'px'}">24px</div>
          <!-- % -->
          <div class="quick-select" @click="changeStyleValue(25, '%')" :class="{ active: currentValueDigit === 25 && currentValueUnit === '%'}">25%</div>
          <div class="quick-select" @click="changeStyleValue(50, '%')" :class="{ active: currentValueDigit === 50 && currentValueUnit === '%'}">50%</div>
          <div class="quick-select" @click="changeStyleValue(100, '%')" :class="{ active: currentValueDigit === 100 && currentValueUnit === '%'}">100%</div>
          <!-- rem -->
          <div class="quick-select" @click="changeStyleValue(1, 'rem')" :class="{ active: currentValueDigit === 1 && currentValueUnit === 'rem'}">1rem</div>
          <!-- em -->
          <div class="quick-select" @click="changeStyleValue(1, 'em')" :class="{ active: currentValueDigit === 1 && currentValueUnit === 'em'}">1em</div>
        </div>
        
        <!-- 操作按钮, 确定和取消 -->
        <div class="mt-4px">
          <n-button-group size="small" class="w-100%">
            <n-button class="w-1/3" type="primary" @click="doChange">确定</n-button>
            <n-button class="w-1/3" type="info" @click="doChangeForAll">应用到四个边</n-button>
            <n-button class="w-1/3" @click="openDialog = false">取消</n-button>
          </n-button-group>
        </div>
      </div>
    </div>
  </n-collapse-transition>
</template>

<style lang="less" scoped>
.margin-rect {
  position: relative;
  width: calc(var(--outer-width) + var(--outer-border) * 2);
  height: calc(var(--outer-height) + var(--outer-border) * 2);
  
  --outer-width: 200px;
  --outer-height: 120px;
  --outer-border: 40px;
  --bg-color: #AAA;
  
  .padding-area {
    position: absolute;
    top: var(--outer-border);
    left: var(--outer-border);
    width: var(--outer-width);
    height: var(--outer-height);
  }
}
.padding-rect {
  width: 100%;
  height: 100%;

  --outer-width: 120px;
  --outer-height: 40px;
  --outer-border: 40px;
  --bg-color: #DDD;
  
}

.tag {
  position: absolute;
  z-index: 1;
  padding: 8px;
}

.top,.bottom,.left,.right {
  cursor: pointer;
  position: absolute;
}
.top, .bottom {
  width: var(--outer-width);
  border-right: var(--outer-border) solid transparent;
  border-left: var(--outer-border) solid transparent;
  left: 50%;
  transform: translateX(-50%);

}
.top {
  border-top: var(--outer-border) solid var(--bg-color);

  &:hover {
    border-top-color: #EEE;
  }
}
.bottom {
  border-bottom: var(--outer-border) solid var(--bg-color);
  bottom: 0;

  &:hover {
    border-bottom-color: #EEE;
  }
}
.left, .right {
  height: var(--outer-height);
  border-top: var(--outer-border) solid transparent;
  border-bottom: var(--outer-border) solid transparent;
  top: 50%;
  transform: translateY(-50%);
}
.left {
  border-left: var(--outer-border) solid var(--bg-color);
  &:hover {
    border-left-color: #EEE;
  }
}
.right {
  border-right: var(--outer-border) solid var(--bg-color);
  right: 0;
  
  &:hover {
    border-right-color: #EEE;
  }
}

.v {
  pointer-events: none;
  height: var(--outer-border);
  width: var(--outer-border);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  &.t, &.b {
    left: 50%;
    transform: translateX(-50%);
  }
  &.b {
    bottom: 0;
  }
  &.l, &.r {
    top: 50%;
    transform: translateY(-50%);
  }
  &.r {
    right: 0;
  }
}

.quick-select {
  cursor: pointer;
  padding: 4px 8px;
  margin: 4px;
  border: 1px solid #DDD;
  border-radius: 4px;
  transition: 0.3s;
  &:hover {
    background: #EEE;
  }
  &.active {
    background: #DDD;
  }
}
</style>