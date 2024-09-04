import { defineStore } from 'pinia'
import type { JsMethod } from '@ruomu-ui/types'

interface pluginFunctionState {
  showMethodPanel: boolean;
  currentMethod: JsMethod;
}

export const usePluginFunctionStore = defineStore('pluginFunction', {
  state: ():pluginFunctionState => ({
    showMethodPanel: false,
    currentMethod: { 
      name: '',
      description: '',
      code: '',
      params: []
    }
  }),
  actions: {
   
  }
})