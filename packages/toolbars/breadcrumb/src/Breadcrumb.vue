<script setup lang="ts">
import {useProjectStore} from "@ruomu-ui/core";

const projectStore = useProjectStore()
</script>

<template>
  <div class="breadcrumb">
    {{ projectStore.project?.name || "" }}
  </div>
</template>

<style scoped>

</style>