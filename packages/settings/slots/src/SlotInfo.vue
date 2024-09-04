<script setup lang="ts">
  import {NSwitch} from "naive-ui";
  import { computed, PropType } from 'vue'
  import { Schema } from '@ruomu-ui/core'
  
  const props = defineProps({
    slotName: {
      type: String,
      required: true
    },
    schema: {
      type: Object as PropType<Schema>,
      required: true
    }
  })
  
  const slotEnabled = computed(() => !!props.schema.slots?.find(s => s.name === props.slotName))
  
  const updateSlotEnabled = (enabled: boolean) => {
    if (enabled) {
      if (!props.schema.slots) {
        props.schema.slots = []
      }
      props.schema.slots?.push({ name: props.slotName })
    } else {
      props.schema.slots = props.schema.slots?.filter(s => s.name !== props.slotName)
    }
  }
</script>

<template>
  <div class="my-4px flex items-center">
    <div class="w-100px">{{ slotName }}</div>
    <n-switch :value="slotEnabled" @update:value="updateSlotEnabled"/>
    
  </div>
</template>

<style scoped>

</style>