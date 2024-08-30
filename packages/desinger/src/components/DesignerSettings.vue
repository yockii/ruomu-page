<script setup lang="ts">
  import { Close, Pin, PinFilled } from '@vicons/carbon'
  import { NIcon, NTooltip, NTabs, NTabPane } from 'naive-ui'
  import { useLayoutStore, type Setting, resolveComponent } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import addons from "../config/addons"
  import { h, onMounted, onUnmounted, ref } from 'vue'
  
  const layoutStore = useLayoutStore()
  const { settingsPanelPinned, showSettingsPanel } = storeToRefs(layoutStore)
  
  const settings = ref<Setting[]>([])
  
  const tabNode = (s: Setting) => {
    // 带图标
    if (s.icon) {
      return h('div', { class: 'flex items-center' }, [
        h(NIcon, { size: 20 }, () => h(resolveComponent(s.icon!), {})),
        h('span', { class: 'ml-4px' },  s.title)
      ])
    }
    return s.title
  }
  
  const panel = ref<HTMLElement | null>(null)
  const panelHeader = ref<HTMLElement | null>(null)
  const isMoving = ref(false)
  const mousePos = ref({ x: 0, y: 0 })
  
  const moveStart = (e: MouseEvent) => {
    if(!settingsPanelPinned.value) {
      isMoving.value = true
      mousePos.value = { x: e.clientX, y: e.clientY }
    }
  }
  const move = (e: MouseEvent) => {
    if (isMoving.value) {
      const dx = e.clientX - mousePos.value.x
      const dy = e.clientY - mousePos.value.y
      if (panel.value) {
        // 用top和right
        panel.value.style.top = `${panel.value.offsetTop + dy}px`
        panel.value.style.left = `${panel.value.offsetLeft + dx}px`
        mousePos.value = { x: e.clientX, y: e.clientY }
      }
    }
  }
  const moveEnd = () => {
    isMoving.value = false
  }
  
  onMounted(() => {
    addons.settings.forEach(s => {
      settings.value.push(s)
    })
    
    // 鼠标拖动监听
    if (panelHeader.value) {
      panelHeader.value.addEventListener('mousedown', moveStart)
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', moveEnd)
    }
  })
  onUnmounted(() => {
    if (panelHeader.value) {
      panelHeader.value.removeEventListener('mousedown', moveStart)
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', moveEnd)
    }
  })
</script>

<template>
  <div ref="panel" v-show="showSettingsPanel" class="settings-panel" :class="{'top-0 right-0 absolute b-1px b-solid b-#666': !settingsPanelPinned}">
    <div ref="panelHeader" class="m-4px flex justify-between items-center" :class="{'cursor-move': !settingsPanelPinned}">
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
          <component :is="resolveComponent(s.component)" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  width: 360px;
  background: #FFF;
  z-index: 99;
}
</style>