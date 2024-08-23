<script setup lang="ts">
  import { computed } from "vue";
  import {darkTheme, zhCN, dateZhCN, NConfigProvider, NLoadingBarProvider, NDialogProvider, NNotificationProvider, NMessageProvider} from "naive-ui"
  import { useAppStore } from "@/store/app"

  const appStore = useAppStore()
  const theme = computed(() => {
    return appStore.theme === "dark" ? darkTheme : null
  })
</script>

<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" class="h-100%">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
