import { defineStore } from 'pinia'
import { JsMethod } from '@ruomu-ui/core'

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