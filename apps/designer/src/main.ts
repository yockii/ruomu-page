import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import "virtual:uno.css"
import initHttp from './http'

initHttp()

createApp(App).use(store).use(router).mount('#app')
