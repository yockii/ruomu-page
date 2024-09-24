<script setup lang="ts">
  import { useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const projectStore = useProjectStore()
  const {pages} = storeToRefs(projectStore)
</script>

<template>
  <div class="w-240px">
    aaa
  </div>
</template>

<style scoped>

</style>