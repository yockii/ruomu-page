<script setup lang="ts">
  import { Plugin, useLayoutStore } from '@ruomu-ui/core'
  import addons from "../config/addons"
  import {NIcon, NTooltip} from "naive-ui";
  import { nextTick, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { usePluginMaterialStore } from '@ruomu-ui/plugin-material/src/Store.ts'
  
  const topPlugins:Plugin[] = []
  const bottomPlugins:Plugin[] = []
  
  addons.plugins.forEach((item:Plugin) => {
    if (item.align === 'bottom') {
      bottomPlugins.push(item)
    } else {
      topPlugins.push(item)
    }
  })
  
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
    usePluginMaterialStore().getLibs()
  })
</script>

<template>
  <div class="w-40px h-100% bg-red flex flex-col justify-between">
    <div class="flex flex-col items-center mt-8px">
      <template v-for="item in topPlugins" :key="item.id">
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <n-icon size="24" @click="togglePluginPanel(item)" class="cursor-pointer mb-8px">
              <component :is="item.icon" />
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