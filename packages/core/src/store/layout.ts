import { defineStore } from 'pinia'
import type { Plugin  } from '@ruomu-ui/types'

interface State {
  device: string;
  iframeWidth: number;
  width: number;
  height: number;
  maxWidth: number;
  minWidth: number;
  scale: number;
  settingsPanelPinned: boolean;
  showSettingsPanel: boolean;
  showPluginPanel: boolean;
  currentPlugin: Plugin | null;
}

export const useLayoutStore = defineStore("layout", {
  state: () :State => ({
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
    currentPlugin: null,
  }),
  persistShare: true,
})