<script setup lang="ts">
  import DesignerToolbar from "./components/DesignerToolbar.vue";
  import DesignerPluginBar from './components/DesignerPluginBar.vue'
  import DesignerSettings from './components/DesignerSettings.vue'
  import DesignerCanvas from './components/DesignerCanvas.vue'
  import { resolveComponent, useLayoutStore } from '@ruomu-ui/core'
  import {Pin, PinFilled, Close} from "@vicons/carbon"
  import {NIcon, NTooltip} from "naive-ui"
  import { storeToRefs } from 'pinia'
  
  const layoutStore = useLayoutStore()
  
  const { showPluginPanel, currentPlugin } = storeToRefs(layoutStore)

</script>

<template>
  <div class="flex flex-col h-100%">
    <designer-toolbar />
    <div class="flex h-100% relative">
      <designer-plugin-bar />
      <div v-if="showPluginPanel && currentPlugin" class="b-0 b-r-1px b-#999 b-solid z-99 bg-#fff" :class="{'absolute left-40px top-0 bottom-0': !currentPlugin.pinned}">
        <div class="flex justify-between p-4px">
          <span>{{currentPlugin.title}}</span>
          <div class="flex items-center">
            <n-tooltip>
              <template #trigger>
                <n-icon @click="currentPlugin.pinned = !currentPlugin.pinned" class="cursor-pointer" size="16">
                  <PinFilled v-if="currentPlugin.pinned" class="-rotate-45" />
                  <Pin v-else />
                </n-icon>
              </template>
              <span>{{currentPlugin.pinned ? '取消固定面板' : '固定面板'}}</span>
            </n-tooltip>
            <n-tooltip>
              <template #trigger>
                <n-icon class="cursor-pointer ml-8px" size="24" @click="showPluginPanel = false">
                  <Close />
                </n-icon>
              </template>
              <span>关闭面板</span>
            </n-tooltip>
          </div>
        </div>
        <component :is="resolveComponent(currentPlugin.component)" />
      </div>
      <div class="flex-1">
        <designer-canvas />
      </div>
      <div class="settings">
        <designer-settings />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  z-index: 4;
  position: relative;
  border-left: 1px solid #666;
}
</style>