<script lang="ts" setup>
  import {PreviewOutlined} from "@vicons/material"
  import {NTooltip, NIcon } from 'naive-ui'
  import { useCanvasStore } from '@ruomu-ui/core'
  
  const canvasStore = useCanvasStore()
  const showPreviewPage = () => {
    const iframeUrl = canvasStore.iframeDom?.contentWindow?.location.href
    if (iframeUrl) {
      // 打开新页面
      window.open(iframeUrl, iframeUrl)
    }
  }
</script>

<template>
  <div class="flex items-center cursor-pointer" @click.stop="showPreviewPage">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="26">
          <PreviewOutlined />
        </n-icon>
      </template>
      <div>
        预览
      </div>
    </n-tooltip>
  </div>
</template>

<style scoped>

</style>