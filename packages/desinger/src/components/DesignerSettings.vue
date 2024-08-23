<script setup lang="ts">
  import { Close, Pin, PinFilled } from '@vicons/carbon'
  import { NIcon, NTooltip, NTabs, NTabPane } from 'naive-ui'
  import { useLayoutStore, type Setting } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import addons from "../config/addons"
  import { h } from 'vue'
  
  const layoutStore = useLayoutStore()
  const { settingsPanelPinned, showSettingsPanel } = storeToRefs(layoutStore)
  
  const settings = addons.settings
  
  const tabNode = (s: Setting) => {
    // 带图标
    if (s.icon) {
      return h('div', { class: 'flex items-center' }, [
        h(NIcon, { size: 20 }, () => [h(s.icon!)]),
        h('span', { class: 'ml-4px' },  s.title)
      ])
    }
    return s.title
  }
</script>

<template>
  <div v-show="showSettingsPanel" class="w-360px h-100% flex flex-col bg-#FFFFFF z-99" :class="{'top-0 right-0 absolute': !settingsPanelPinned}">
    <div class="m-4px flex justify-between items-center">
      <n-tooltip>
        <template #trigger>
          <n-icon @click="settingsPanelPinned = !settingsPanelPinned" class="cursor-pointer" size="16">
            <PinFilled v-if="settingsPanelPinned" class="-rotate-45" />
            <Pin v-else />
          </n-icon>
        </template>
        <span>{{settingsPanelPinned ? '取消固定面板' : '固定面板'}}</span>
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
          <n-icon class="cursor-pointer ml-8px" size="24" @click="showSettingsPanel = false">
            <Close />
          </n-icon>
        </template>
        <span>关闭面板</span>
      </n-tooltip>
    </div>
    <div class="my-4px mx-8px">
      <n-tabs type="segment" animated default-value="props">
        <n-tab-pane v-for="s in settings" :key="s.id" :name="s.id" :tab="tabNode(s)">
          <component :is="s.component" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<style scoped>

</style>