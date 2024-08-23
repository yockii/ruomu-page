<script setup lang="ts">
import {NIcon} from "naive-ui"
import {FullscreenRound, FullscreenExitRound} from "@vicons/material"
import { onMounted, ref } from 'vue'

const isFullscreen = ref(false)

const toggle = () => {
  const element:any = document.documentElement;
  if (isFullscreen.value) {
    const el = element.ownerDocument
    const cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.exitFullscreen;
    if (cfs) {
      cfs.call(el);
      isFullscreen.value = false
    }
    
    // // 考虑不同浏览器
    // if (element.exitFullscreen) {
    //   element.exitFullscreen();
    //   isFullscreen.value = false
    // } else if (element.cancelFullScreen) {
    //   element.cancelFullScreen();
    //   isFullscreen.value = false
    // } else if (element.mozCancelFullScreen) {
    //   element.mozCancelFullScreen();
    //   isFullscreen.value = false
    // } else if (element.webkitCancelFullScreen) {
    //   element.webkitCancelFullScreen();
    //   isFullscreen.value = false
    // } else if (element.msExitFullscreen) {
    //   element.msExitFullscreen();
    //   isFullscreen.value = false
    // }
    
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      isFullscreen.value = true
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      isFullscreen.value = true
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
      isFullscreen.value = true
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
      isFullscreen.value = true
    }
    
  }
}

onMounted(() => {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
})
</script>

<template>
  <div class="flex flex-col">
    <n-icon @click="toggle" class="cursor-pointer" size="26">
      <FullscreenExitRound v-if="isFullscreen" />
      <FullscreenRound v-else />
    </n-icon>
  </div>
</template>

<style scoped>

</style>