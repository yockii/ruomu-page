import { defineStore } from 'pinia'
import { Plugin  } from '../types'

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
    
    showPluginPanel: false,
    currentPlugin: null as Plugin | null,
  }),
  persistShare: true,
})