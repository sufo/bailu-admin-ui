import { defineStore } from "pinia";
import { deepMerge } from "@/utils/util"
import { store } from '@/store';
import { useUserStore } from "./user";
import { Page } from '@/constants/enum'
import { menuApi } from "@/api/admin";
import { AppRouteRecordRaw } from "~/types/route";
import { asyncImportRoute, transformRouteToMenu, flatAsyncRoutes } from "@/router/helper/helpers";
import { RouteRecordRaw } from 'vue-router';
import { router } from '@/router';
import { NOT_FOUND } from "@/router/routes";

export const EXCEPTION_COMPONENT = () => import('@/views/exception.vue');


interface AsyncRouteState {

  /** Whether the route has been dynamically added */
  isDynamicAddedRoute: boolean; //路由是否已动态添加
  // To trigger a menu update
  lastBuildMenuTime: number;
  /** 菜单 */
  menus: App.Menu[];
  /** 缓存的路由名称 */
  // keepAliveComponents: string[];
}

export const useAsyncRouteStore = defineStore("app-async-route", {
  state: (): AsyncRouteState => ({
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    menus: [],
    // keepAliveComponents: []
  }),

  getters: {
    //2589
    getMenus(state): App.Menu[] {
      //@ts-ignore 
      return state.menus
    }
  },

  actions: {

    setMenu(list: App.Menu[]) {
      //@ts-ignore
      this.menus = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setAsyncRoute(asyncRoute: Partial<AsyncRouteState>) {
      this.$state = deepMerge(this.$state || {}, asyncRoute);
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },

    async buildRoutes(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore()

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore.getUserInfo?.homePath || Page.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      let routes: AppRouteRecordRaw[] = []
      //动态从服务端获取
      if (import.meta.env.VITE_PERMISSION_MODE === 'DYNAMIC') {
        //通过后台获取
        routes = await menuApi.getRoutes()
        // Dynamically introduce components
        asyncImportRoute(routes)

      }
      //本地静态 static routes
      else { //static routes
        this.initStaticRoute(routes)

      }
      //routes to menu structure
      const menuList = transformRouteToMenu(routes);
      this.setMenu(menuList);
      //flat 
      flatAsyncRoutes(routes)
      //affix
      patchHomeAffix(routes);
      return routes;

    },

    //route处理
    async initRoute() {

      if (!this.isDynamicAddedRoute) {
        const routes = await this.buildRoutes()
        console.log("routes", routes)
        //@ts-ignore
        routes.forEach(r => {
          if (!r.meta.isFrame) {
            router.addRoute(r as unknown as RouteRecordRaw)

            // 2. 【关键点】为每个拥有 children 的一级路由添加子级 404
            // 这样访问 /system/abc 时，会匹配到 /system 下的这个通配符
            if (r.children && r.children.length > 0) {
              router.addRoute(r.name, {
                path: ':pathMatch(.*)*',
                name: `${String(r.name)}Child404`,
                component: EXCEPTION_COMPONENT, // 局部 404 组件
                meta: { title: '404', hide: true }
              })
            }
          }
        });
        //PAGE_EXCEPT最后添加
        router.addRoute(NOT_FOUND as RouteRecordRaw);
        //已经添加
        this.setDynamicAddedRoute(true)
      }
    },


    /** 初始化静态路由 */
    initStaticRoute(routes: AppRouteRecordRaw[]) {
      //TODO
    },

  }
})

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
