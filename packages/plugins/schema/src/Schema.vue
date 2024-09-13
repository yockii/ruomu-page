<script setup lang="ts">
import { JsonViewer } from '@ruomu-ui/editor'
import { useProjectStore } from '@ruomu-ui/core'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const {currentPageSchema} = storeToRefs(projectStore)

</script>

<template>
  <div class="schema-container">
   <json-viewer :json-value="currentPageSchema" />
  </div>
</template>

<style scoped>
.schema-container {
  width: 480px;
  height: calc(100% - 60px);
}
</style>