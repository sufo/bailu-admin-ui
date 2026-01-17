
/**
 * vite-plugin-pages
 * vite-plugin-vue-layouts
 */
import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import type { App } from "vue";

import { basicRoutes } from './routes'
import { scrollBehavior } from '@/router/helper/scroll'
import { setupRouteGuard } from "./guard"

const { VITE_PUBLIC_PATH } = import.meta.env;
const VITE_HASH_ROUTE = (import.meta.env.VITE_HASH_ROUTE as unknown as string) !== 'false';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
getRouteNames(basicRoutes);


//app router
export const router = createRouter({
  history: VITE_HASH_ROUTE ? createWebHashHistory(VITE_PUBLIC_PATH) : createWebHistory(VITE_PUBLIC_PATH),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,

  scrollBehavior,
})

//reset
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) { // 这里应该排除基本静态路由
      router.hasRoute(name) && router.removeRoute(name);
    }
  })
}

export async function setupRouter(app: App<Element>) {
  app.use(router);
  setupRouteGuard(router);
  await router.isReady()
}

