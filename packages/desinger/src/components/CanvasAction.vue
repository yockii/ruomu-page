<script setup lang="ts">
  import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'
import {NIcon, NTooltip} from 'naive-ui'
import {FolderParent,ArrowUp,ArrowDown, Delete} from '@vicons/carbon'

const canvasStore = useCanvasStore()
const projectStore = useProjectStore()
const {hoverState, selectState, lineState} = storeToRefs(canvasStore)

const selectParent = () => {
  const currentId = selectState.value?.id
  if (!currentId) return
  const parent = projectStore.parentSchema(currentId)
  if(parent && parent.id) {
    canvasStore.selectNodeById(parent.id)
  }
}

const move = (after: boolean = false) => {
  const current = selectState.value
  if (!current) return
  const parent = projectStore.parentSchema(current.id)
  if (!parent) return
  const index = parent.children?.findIndex((item) => item.id === current.id)
  if (index === 0 && !after) return
  if (index === parent.children.length - 1 && after) return
  
  canvasStore.clearSelectState()
  const target = parent.children[after ? index + 1 : index - 1]
  const currentSchema = projectStore.findSchemaSegment(current.id)
  projectStore.moveSchema(currentSchema, target.id, after ? 'bottom' : 'top')
  setTimeout(() => {
    canvasStore.selectNodeById(currentSchema.id)
  }, 100)
}
const remove = () => {
  const current = selectState.value
  if (!current) return
  canvasStore.clearSelectState()
  projectStore.removeSchema(current.id)
}
</script>

<template>
  <div v-show="selectState.width && selectState.height" class="rect select">
    <div class="marker-top-left">
      <span>{{selectState.componentName}}</span>
      <span v-if="selectState.configure?.isContainer">容器</span>
    </div>
    <div class="marker-bottom-right">
      <!-- 父级、上移、下移、删除 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="16" class="mr-4px cursor-pointer" @click="selectParent">
            <FolderParent />
          </n-icon>
        </template>
        <span>选择父级</span>
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
          <n-icon size="16" class="mr-4px cursor-pointer" @click="move()">
            <ArrowUp />
          </n-icon>
        </template>
        <span>前移</span>
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
          <n-icon size="16" class="mr-4px cursor-pointer" @click="move(true)">
            <ArrowDown />
          </n-icon>
        </template>
        <span>后移</span>
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
          <n-icon size="16" class=" cursor-pointer" @click="remove">
            <Delete />
          </n-icon>
        </template>
        <span>删除</span>
      </n-tooltip>
    </div>
  </div>
  
  
  <div v-show="hoverState.width && hoverState.height" class="rect hover">
    <div class="marker-top-left">{{hoverState.componentName}}</div>
    <div v-show="hoverState.configure?.isContainer" class="marker-bottom-right">拖放元素到容器内</div>
  </div>
  
  <div v-show="lineState.width&&lineState.height" class="rect line">
    <div class="hover" :class="[lineState.position, {'forbidden': lineState.forbidden}]">
      <div v-if="lineState.position === 'in' && hoverState.configure" class="choose-slots"></div>
    </div>
  </div>
  
</template>

<style lang="less" scoped>
.rect {
  position: absolute;
  border: 1px dashed #18A058;
  pointer-events: none;
  box-sizing: border-box;
  z-index: 2;
  
  &.absolute {
    pointer-events: all;
  }
  &.hover {
    border-style: dashed;
    top: v-bind("hoverState.top + 'px'");
    left: v-bind("hoverState.left + 'px'");
    width: v-bind("hoverState.width + 'px'");
    height: v-bind("hoverState.height + 'px'");
    
    .marker-top-left, .marker-bottom-right {
      position: absolute;
      height: 14px;
      padding-left: 0;
      font-size: 12px;
    }
    .marker-top-left {
      top: -14px;
      left: 0;
    }
    .marker-bottom-right {
      right: -1px;
      bottom: -20px;
      background: #FEFEFE;
      border: 1px solid #EFEFEF;
      padding: 0 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  
  &.select {
    z-index: 3;
    border-width: 2px;
    border-style: solid;
    top: v-bind("selectState.top + 'px'");
    left: v-bind("selectState.left + 'px'");
    width: v-bind("selectState.width + 'px'");
    height: v-bind("selectState.height + 'px'");
    
    .marker-top-left, .marker-bottom-right {
      position: absolute;
      height: 16px;
      padding-left: 0;
      font-size: 12px;
    }
    .marker-top-left {
      top: -14px;
      left: 0;
    }
    .marker-bottom-right {
      right: -1px;
      bottom: -20px;
      background: #18A058;
      color: #FFFFFF;
      border: 1px solid #EFEFEF;
      padding: 0 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      pointer-events: all;
      display: flex;
    }
  }
  
  &.line {
    border-color: transparent;
    top: v-bind("lineState.top + 'px'");
    left: v-bind("lineState.left + 'px'");
    width: v-bind("lineState.width + 'px'");
    height: v-bind("lineState.height + 'px'");
    
    .hover {
      &.top {
        width: 100%;
        height: 5px;
        background: #18A058;
        position: absolute;
        top: -3px;
      }
      &.left {
        width: 5px;
        height: 100%;
        background: #18A058;
        position: absolute;
        left: -3px;
      }
      &.bottom {
        width: 100%;
        height: 5px;
        background: #18A058;
        position: absolute;
        bottom: -3px;
      }
      &.right {
        width: 5px;
        height: 100%;
        background: #18A058;
        position: absolute;
        right: -3px;
      }
      &.in {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(24, 160, 88, 0.1);
        &.forbidden {
          background: rgba(160, 24, 24, 0.1);
        }
      }
      &.forbidden:not(.in) {
        background: rgba(160, 24, 24, 0.1);
      }
      
      .choose-slots {
        display: flex;
        justify-content: start;
        align-items: start;
        height: 100%;
      }
    }
  }
}
</style>