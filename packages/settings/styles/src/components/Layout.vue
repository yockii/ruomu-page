<script setup lang="ts">
  import {NCollapseTransition, NTooltip, NIcon} from 'naive-ui'
  import { computed, ref } from 'vue'
  import { ChevronDown, ChevronUp } from "@vicons/tabler"
  import { storeToRefs } from 'pinia'
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
  import { changeStyle } from "../util"

  const expanded = ref(true)
  
  const canvasStore = useCanvasStore()
  const projectStore = useProjectStore()
  const {selectState} = storeToRefs(canvasStore)

  const currentDisplay = computed(() => {
    return projectStore.styleValue(selectState.value.id, "display") || ""
  })
  
  const currentStyleValue = computed(() => {
    return (styleName: string) => {
      return projectStore.styleValue(selectState.value.id, styleName) || ""
    }
  })
  
  const changeDisplay = (type: string) => {
    // props.style: display: block | flex
    changeStyle("display", type)
  }
  
  const flexOpts = ref([
    {
      title: '主轴方向',
      styleName: 'flexDirection',
      items: [
        {
          title: '水平',
          value: 'row'
        },
        {
          title: '水平反向',
          value: 'row-reverse'
        },
        {
          title: '垂直',
          value: 'column'
        },
        {
          title: '垂直反向',
          value: 'column-reverse'
        }
      ]
    },
    {
      title: '主轴对齐',
      styleName: 'justifyContent',
      items: [
        {
          title: '左对齐',
          value: 'flex-start'
        },
        {
          title: '右对齐',
          value: 'flex-end'
        },
        {
          title: '居中',
          value: 'center'
        },
        {
          title: '两端对齐',
          value: 'space-between'
        },
        {
          title: '环绕对齐',
          value: 'space-around'
        }
      ]
    },
    {
      title: '交叉轴对齐',
      styleName: 'alignItems',
      items: [
        {
          title: '顶部对齐',
          value: 'flex-start'
        },
        {
          title: '底部对齐',
          value: 'flex-end'
        },
        {
          title: '居中',
          value: 'center'
        },
        {
          title: '基线对齐',
          value: 'baseline'
        },
        {
          title: '拉伸',
          value: 'stretch'
        }
      ]
    },
    {
      title: '换行',
      styleName: 'flexWrap',
      items: [
        {
          title: '不换行',
          value: 'nowrap'
        },
        {
          title: '换行',
          value: 'wrap'
        },
        {
          title: '反向换行',
          value: 'wrap-reverse'
        }
      ]
    }
  ])
</script>

<template>
  <div class="bg-#EFEFEF flex mt-8px px-8px h-36px items-center justify-between cursor-pointer" @click="expanded = !expanded">
    <span>布局</span>
    <n-icon size="18">
      <ChevronUp v-if="expanded"/>
      <ChevronDown v-else/>
    </n-icon>
  </div>
  <n-collapse-transition :show="expanded">
    <div class="flex flex-col m-4px">
      <div class="flex justify-between">
        <div class="mr-4px">布局方式</div>
        <div class="flex flex-1 justify-around">
          <n-tooltip>
            <template #trigger>
              <div class="cursor-pointer" :class="{'bg-#CCC': currentDisplay === 'block'}" @click="changeDisplay('block')">B</div>
            </template>
            Block
          </n-tooltip>
          <n-tooltip>
            <template #trigger>
              <div class="cursor-pointer" :class="{'bg-#CCC': currentDisplay === 'flex'}" @click="changeDisplay('flex')">F</div>
            </template>
            Flow
          </n-tooltip>
          <n-tooltip>
            <template #trigger>
              <div class="cursor-pointer" :class="{'bg-#CCC': currentDisplay === 'grid'}" @click="changeDisplay('grid')">G</div>
            </template>
            Grid
          </n-tooltip>
          <n-tooltip>
            <template #trigger>
              <div class="cursor-pointer" :class="{'bg-#CCC': currentDisplay === 'none'}" @click="changeDisplay('none')">N</div>
            </template>
            None
          </n-tooltip>
        </div>
      </div>
    </div>
    
    <!-- flex -->
    <div v-if="currentDisplay === 'flex'" class="mt-4px">
      <div v-for="opt in flexOpts" :key="opt.styleName" class="m-4px flex flex-wrap">
        <div class="mr-4px">{{opt.title}}</div>
        <template v-for="item in opt.items" :key="item.value">
          <n-tooltip>
            <template #trigger>
              <div class="cursor-pointer mr-4px" :class="{'bg-#CCC': currentStyleValue(opt.styleName) === item.value}" @click="changeStyle(opt.styleName, item.value)">{{item.title}}</div>
            </template>
            {{item.title}}
          </n-tooltip>
        </template>
      </div>
    </div>
  </n-collapse-transition>
</template>

<style scoped>

</style>