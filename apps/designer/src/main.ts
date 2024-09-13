import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import "virtual:uno.css"
import initHttp from './http'

import loader from '@monaco-editor/loader'
import * as monaco from 'monaco-editor'

loader.config({
  monaco
})

loader.config({
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  }
})

initHttp()

createApp(App).use(store).use(router).mount('#app')
