<script setup lang="ts">
import type {Toolbar} from "@ruomu-ui/core";
import addons from "../config/addons"

const leftBar:Toolbar[] = []
const rightBar:Toolbar[] = []
const centerBar:Toolbar[] = []

addons.toolbars.forEach((item:Toolbar) => {
  if (item.align === 'right') {
    rightBar.push(item)
  } else if (item.align === 'center') {
    centerBar.push(item)
  } else {
    leftBar.push(item)
  }

})
</script>

<template>
  <div class="flex justify-between bg-#FFF h-40px b-b-solid b-b-2px b-b-coolgray items-center px-8px">
    <div class="flex items-center flex-1">
      <component v-for="item in leftBar" :key="item.id" :is="item.component" class="mr-8px" />
    </div>
    <div class="flex flex-1 justify-center">
      <component v-for="item in centerBar" :key="item.id" :is="item.component" />
    </div>
    <div class="flex flex-1 justify-end">
      <component v-for="item in rightBar" :key="item.id" :is="item.component" />
    </div>
  </div>
</template>

<style scoped>

</style>