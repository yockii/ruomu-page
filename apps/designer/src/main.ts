import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import "virtual:uno.css"
import initHttp from './initialize/http'
import initAddons from './initialize/addons'

initHttp()
initAddons()

createApp(App).use(store).use(router).mount('#app')
