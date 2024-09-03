<script setup lang="ts">
  import {NSwitch} from "naive-ui";
  import { PropType } from 'vue'
  import { Schema } from '@ruomu-ui/core'
  
const props = defineProps({
  slot: {
    type: String,
    required: true
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true
  }
})
</script>

<template>
  <div class="my-4px flex items-center">
    <div class="w-120px">{{ slot }}</div>
    <n-switch />
  </div>
</template>

<style scoped>

</style>