<script lang="ts" setup>
  import {DocumentSave24Filled, DocumentSave24Regular} from "@vicons/fluent"
  import {NTooltip, NIcon } from 'naive-ui'
  import { useProjectStore } from '@ruomu-ui/core'
  import { computed } from 'vue'
  
  const projectStore = useProjectStore()
  
  const needSave = computed(() => projectStore.pageDirt || projectStore.projectDirt)
  const saveProjectOrPage = () => {
    if (needSave.value) {
      projectStore.save()
    }
  }
</script>

<template>
  <div class="flex items-center" :class="{'cursor-not-allowed': !needSave, 'cursor-pointer': needSave}" @click="saveProjectOrPage">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="26">
          <DocumentSave24Filled v-if="needSave"/>
          <DocumentSave24Regular v-else />
        </n-icon>
      </template>
      <div>
        保存
      </div>
    </n-tooltip>
  </div>
</template>

<style scoped>

</style>