import { defineStore } from 'pinia'

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    device: 'desktop',
    iframeWidth: 1200,
    width: 1200,
    height: 800,
    maxWidth: 1200,
    minWidth: 992,
    scale: 1.0,
    settingsPanelPinned: true,
    showSettingsPanel: true,
  }),
  persistShare: true,
})