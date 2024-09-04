<script lang="ts" setup>
  import { computed, ref, shallowRef } from 'vue'
  import { Screen, Laptop, TabletLandscape, Tablet, MobileLandscape, Mobile } from '@vicons/carbon'
  import { NTooltip, NIcon, NSlider } from 'naive-ui'
  import { useLayoutStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'

  const layoutStore = useLayoutStore()
  const {width, maxWidth, minWidth, device, scale } = storeToRefs(layoutStore)

  type Media = {
    name: string
    icon: any
    minWidth?: number
    maxWidth?: number
    title: string
    description: string
  }
  
  const mediaList = ref([
    {
      name: 'bigScreen',
      icon: shallowRef(Screen),
      minWidth: 1200,
      title: '大屏',
      description: '1200px以上的大屏幕',
    },
    {
      name: 'desktop',
      icon: shallowRef(Laptop),
      minWidth: 992,
      maxWidth: 1200,
      title: '桌面',
      description: '992px-1199px的桌面',
    },
    {
      name: 'tabletLandscape',
      icon: shallowRef(TabletLandscape),
      minWidth: 768,
      maxWidth: 992,
      title: '平板横屏',
      description: '768px-991px的平板横屏',
    },
    {
      name: 'tablet',
      icon: shallowRef(Tablet),
      minWidth: 576,
      maxWidth: 768,
      title: '平板',
      description: '576px-767px的平板',
    },
    {
      name: 'mobileLandscape',
      icon: shallowRef(MobileLandscape),
      minWidth: 480,
      maxWidth: 576,
      title: '手机横屏',
      description: '481px-575px的手机横屏',
    },
    {
      name: 'mobile',
      icon: shallowRef(Mobile),
      minWidth: 360,
      maxWidth: 480,
      title: '手机',
      description: '480px以下的手机',
    },
  ])

  const currentMedia = computed(() => {
    const result = mediaList.value.find(media => {
      if (media.minWidth && media.maxWidth) {
        return width.value >= media.minWidth && width.value < (media.maxWidth)
      } else if (media.minWidth) {
        return width.value >= (media.minWidth)
      } else if (media.maxWidth) {
        return width.value < (media.maxWidth)
      }
    })
    if (result) {
      return result
    }
    return mediaList.value[0]
  })
  const changeMedia = (media:Media) => {
    width.value = media.minWidth || media.maxWidth || 992
    maxWidth.value = media.maxWidth
    minWidth.value = media.minWidth
    device.value = media.name
  }
</script>

<template>
  <div class="flex items-center">
    <div v-for="media in mediaList" :key="media.name" class="ml-8px cursor-pointer" @click="changeMedia(media)">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon :color="currentMedia.name === media.name ? '#0e7a0d' : ''" size="26">
            <component :is="media.icon"></component>
          </n-icon>
        </template>
        <div>
          <p>{{ media.title }}</p>
          <p>{{ media.description }}</p>
        </div>
      </n-tooltip>
    </div>
    <div class="flex ml-8px cursor-pointer">
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="w-80px">
            <n-slider v-model:value="scale" :step="0.01" :min="0.1" :max="1" :tooltip="false" />
          </div>
        </template>
          缩放倍数{{scale}}
      </n-tooltip>
    </div>
  </div>
</template>

<style scoped>

</style>