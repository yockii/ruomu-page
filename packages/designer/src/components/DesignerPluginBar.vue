<script setup lang="ts">
  import type { Plugin } from '@ruomu-ui/types'
  import { useLayoutStore, resolveComponent } from '@ruomu-ui/core'
  import addons from "../config/addons"
  import {NIcon, NTooltip} from "naive-ui";
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { usePluginMaterialStore } from '@ruomu-ui/plugin-material'
  
  const topPlugins = ref<Plugin[]>([])
  const bottomPlugins = ref<Plugin[]>([])
  const middlePlugins = ref<Plugin[]>([])
  
  
  const togglePluginPanel = (plugin: Plugin) => {
    if (currentPlugin.value) {
      if (currentPlugin.value.id === plugin.id) {
        showPluginPanel.value = !showPluginPanel.value
      } else {
        currentPlugin.value = plugin
        showPluginPanel.value = true
      }
    } else {
      currentPlugin.value = plugin
      showPluginPanel.value = true
    }
  }

  const layoutStore = useLayoutStore()

  const { showPluginPanel, currentPlugin } = storeToRefs(layoutStore)
  
  onMounted(() => {
    addons.plugins.forEach((item:Plugin) => {
      if (item.align === 'bottom') {
        bottomPlugins.value.push(item)
      } else if (item.align === 'middle') {
        middlePlugins.value.push(item)
      } else {
        topPlugins.value.push(item)
      }
    })

    showPluginPanel.value = false
    
    usePluginMaterialStore().getLibs()
  })
</script>

<template>
  <div class="w-40px h-100% flex flex-col justify-between z-99 b-r-1px b-r-solid b-#CCC">
    <div class="flex flex-col items-center mt-8px" v-for="(pluginGroup, i) in [topPlugins, middlePlugins, bottomPlugins]" :key="i">
      <template v-for="item in pluginGroup" :key="item.id">
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <n-icon size="24" @click="togglePluginPanel(item)" class="cursor-pointer mb-16px" :class="{'active': showPluginPanel && currentPlugin?.id === item.id }">
              <component :is="resolveComponent(item.icon!)" />
            </n-icon>
          </template>
          {{item.title}}
        </n-tooltip>
      </template>
    </div>
  </div>
</template>

<style scoped>
.active {
  color: #409EFF;
}
</style>