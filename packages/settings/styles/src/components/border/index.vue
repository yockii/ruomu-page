<script setup lang="ts">
  import { NCollapseTransition, NIcon } from 'naive-ui'
  import { ChevronDown, ChevronUp } from '@vicons/tabler'
  import { computed, ref } from 'vue'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import Width from './comps/Width.vue'
  import BorderStyle from './comps/Style.vue'
  import Color from './comps/Color.vue'
  const expanded = ref(true)
  
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)

  const border = computed(() => {
    // border: top/bottom/left/right, width, style, color
    return {
      borderTopWidth: projectStore.styleValue(selectState.value.id, "borderTopWidth") || '0',
      borderTopStyle: projectStore.styleValue(selectState.value.id, "borderTopStyle") || 'none',
      borderTopColor: projectStore.styleValue(selectState.value.id, "borderTopColor") || '#000',
      borderBottomWidth: projectStore.styleValue(selectState.value.id, "borderBottomWidth") || '0',
      borderBottomStyle: projectStore.styleValue(selectState.value.id, "borderBottomStyle") || 'none',
      borderBottomColor: projectStore.styleValue(selectState.value.id, "borderBottomColor") || '#000',
      borderLeftWidth: projectStore.styleValue(selectState.value.id, "borderLeftWidth") || '0',
      borderLeftStyle: projectStore.styleValue(selectState.value.id, "borderLeftStyle") || 'none',
      borderLeftColor: projectStore.styleValue(selectState.value.id, "borderLeftColor") || '#000',
      borderRightWidth: projectStore.styleValue(selectState.value.id, "borderRightWidth") || '0',
      borderRightStyle: projectStore.styleValue(selectState.value.id, "borderRightStyle") || 'none',
      borderRightColor: projectStore.styleValue(selectState.value.id, "borderRightColor") || '#000',
    }
  })


</script>

<template>
  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="expanded = !expanded">
    <span>边框</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>

  <n-collapse-transition :show="expanded">
    <div class="m-4px flex justify-center">
      <div class="border">
        <div class="top" ></div>
        <div class="bottom" ></div>
        <div class="left" ></div>
        <div class="right" ></div>

        <div class="v t">
          <width style-name="borderTopWidth" :default-value="border.borderTopWidth" />
          <border-style style-name="borderTopStyle" :default-value="border.borderTopStyle" />
          <color style-name="borderTopColor" :default-value="border.borderTopColor" />
        </div>
        <div class="v b">
          <width style-name="borderBottomWidth" :default-value="border.borderBottomWidth" />
          <border-style style-name="borderBottomStyle" :default-value="border.borderBottomStyle" />
          <color style-name="borderBottomColor" :default-value="border.borderBottomColor" />
        </div>
        <div class="v l">
          <width style-name="borderLeftWidth" :default-value="border.borderLeftWidth" />
          <border-style style-name="borderLeftStyle" :default-value="border.borderLeftStyle" />
          <color style-name="borderLeftColor" :default-value="border.borderLeftColor" />
        </div>
        <div class="v r">
          <width style-name="borderRightWidth" :default-value="border.borderRightWidth" />
          <border-style style-name="borderRightStyle" :default-value="border.borderRightStyle" />
          <color style-name="borderRightColor" :default-value="border.borderRightColor" />
        </div>
      </div>
      
    </div>
  </n-collapse-transition>
</template>

<style lang="less" scoped>
.border {
  position: relative;
  width: calc(var(--outer-width) + var(--outer-border) * 2);
  height: calc(var(--outer-height) + var(--outer-border) * 2);

  --outer-width: 200px;
  --outer-height: 120px;
  --outer-border: 40px;
  --bg-color: #AAA;


  .top,.bottom,.left,.right {
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
      flex-direction: column;
      top: 50%;
      transform: translateY(-50%);
    }
    &.r {
      right: 0;
    }
  }
}


</style>