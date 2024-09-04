<script setup lang="ts">
  import type { Plugin } from '@ruomu-ui/types'
  import { useLayoutStore, resolveComponent } from '@ruomu-ui/core'
  import addons from "../config/addons"
  import {NIcon, NTooltip} from "naive-ui";
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { usePluginMaterialStore } from '@ruomu-ui/plugin-material'
  import PluginMaterial from '@ruomu-ui/plugin-material'
  
  const topPlugins = ref<Plugin[]>([])
  const bottomPlugins = ref<Plugin[]>([])
  
  
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
      } else {
        topPlugins.value.push(item)
      }
    })
    
    // if (!currentPlugin.value) {
      currentPlugin.value = PluginMaterial
      showPluginPanel.value = true
    // }
    
    usePluginMaterialStore().getLibs()
  })
</script>

<template>
  <div class="w-40px h-100% bg-red flex flex-col justify-between z-99">
    <div class="flex flex-col items-center mt-8px">
      <template v-for="item in topPlugins" :key="item.id">
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <n-icon size="24" @click="togglePluginPanel(item)" class="cursor-pointer mb-8px">
              <component :is="resolveComponent(item.icon!)" />
            </n-icon>
          </template>
          {{item.title}}
        </n-tooltip>
      </template>
    </div>
    <div class="flex flex-col items-center">
     <!-- bottomPlugins -->
    </div>
  </div>
</template>

<style scoped>

</style>