<script setup lang="ts">
  import type { Plugin } from '@ruomu-ui/core';
  import addons from "../config/addons"
  import {NIcon, NTooltip} from "naive-ui";
  import { onMounted } from 'vue'
  
  const emit = defineEmits(['showPluginPanel'])
  
  const topPlugins:Plugin[] = []
  const bottomPlugins:Plugin[] = []
  
  addons.plugins.forEach((item:Plugin) => {
    if (item.align === 'bottom') {
      bottomPlugins.push(item)
    } else {
      topPlugins.push(item)
    }
  })
  
  const showPluginPanel = (plugin: Plugin) => {
    emit('showPluginPanel', plugin)
  }
  
  onMounted(() => {
    // 打开物料插件窗口
    showPluginPanel(addons.plugins[0])
  })
</script>

<template>
  <div class="w-40px h-100% bg-red flex flex-col justify-between">
    <div class="flex flex-col items-center mt-8px">
      <template v-for="item in topPlugins" :key="item.id">
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <n-icon size="24" @click="showPluginPanel(item)" class="cursor-pointer mb-8px">
              <component :is="item.icon" />
            </n-icon>
          </template>
          {{item.title}}
        </n-tooltip>
      </template>
    </div>
    <div class="flex flex-col items-center">
     
    </div>
  </div>
</template>

<style scoped>

</style>