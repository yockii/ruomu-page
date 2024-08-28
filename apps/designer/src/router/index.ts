import {
  createRouter, 
  createWebHistory,
  isNavigationFailure,
} from 'vue-router'
import type {RouteRecordRaw} from "vue-router";
import { createDiscreteApi } from "naive-ui";
const { loadingBar } = createDiscreteApi(["loadingBar"]);

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    alias: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/designer",
    name: "Designer",
    component: () => import("@/views/Designer.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((_to, _from, next) => {
    loadingBar.start();
    next();
});

router.afterEach((_to, _from, failure) => {
  loadingBar.finish();
    if (isNavigationFailure(failure)) {
        console.error(failure);
        return
    }
})

export default router;
