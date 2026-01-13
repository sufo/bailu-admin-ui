import { Router, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import projectSetting from '@/settings/projectSetting';
import storage from '@/utils/storage';
import { ThemeCacheKey } from '@/constants/enum';
import { toTabRoute } from '@/router/helper/helpers';
import { Page } from '@/constants/enum';
import { PAGE_EXCEPT_NAME, REDIRECT_NAME, PAGE_NOT_FOUND_NAME } from '@/router/routes';

import { useGo, useRouterPush } from '@/hooks/common/usePage';

function handleGotoPage(router: Router) {
  const go = useGo(router);
  go(unref(router.currentRoute).path, true);
}

const getToTarget = (tabItem: App.TabRoute) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
};

const findTabIndex = (tabs: App.TabRoute[], fullPath: string) => {
  return tabs.findIndex(tab => tab.fullPath === fullPath);
}


export interface TabState {
  //keep alive
  cachePages: Set<string>;
  //
  tabs: App.TabRoute[];
  // 最后移动的tab索引
  lastDragEndIndex: number;
  /** 当前激活状态的页签(路由fullPath) */
  activeTab: string;
}

//本地存储tabs
const persist = projectSetting.tab.persist;


export const useTabStore = defineStore("app-tabs-store", {
  state: (): TabState => ({
    cachePages: new Set(),
    tabs: persist ? storage.get(ThemeCacheKey.TABS) || [] : [],
    lastDragEndIndex: 0,
    activeTab: '',
  }),

  getters: {
    getTabs: state => state.tabs,

    getCachePages: state => Array.from(state.cachePages),

    getLastDragEndIndex: state => state.lastDragEndIndex,

    /** 当前激活状态的页签索引 */
    activeTabIndex(state) {
      const { tabs, activeTab } = state;
      return tabs.findIndex(tab => tab.fullPath === activeTab);
    }
  },

  actions: {
    /**
     * Update the cache according to the currently opened tabs
     */
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set();

      for (const tab of this.tabs) {
        // Ignore the cache
        const needCache = !tab.meta?.ignoreKeepAlive;
        if (!needCache) {
          continue;
        }
        const name = tab.name as string;
        cacheMap.add(name);
      }
      this.cachePages = cacheMap;
    },

    /**
     * 设置当前路由对应的页签为激活状态
     * @param fullPath - 路由fullPath
     */
    setActiveTab(fullPath: string) {
      this.activeTab = fullPath;
    },

    /**
     * Refresh tabs
     */
    async refreshPage(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const name = route.name;

      const findTab = this.getCachePages.find((item) => item === name);
      if (findTab) {
        this.cachePages.delete(findTab);
      }

      const { fullPath, query } = route;
      router.replace({
        path: "/redirect" + fullPath,
        query: query
      });
    },

    clearCachePages(): void {
      this.cachePages = new Set();
    },
    resetState(): void {
      this.tabs = [];
      this.clearCachePages();
    },
    goToPage(router: Router) {
      const go = useGo(router);
      const len = this.tabs.length;
      const { path } = unref(router.currentRoute);

      let toPath: Page | string = Page.BASE_HOME;

      if (len > 0) {
        const page = this.tabs[len - 1];
        const p = page.fullPath || page.path;
        if (p) toPath = p;
      }
      // Jump to the current page and report an error
      // path !== toPath && go(toPath as Page, true);
      if (path !== toPath) {
        this.setActiveTab(toPath)
        go(toPath as Page, true);
      }
    },

    // async addTab(route: RouteLocationNormalized) {
    //   const tab = toTabRoute(route);
    //   const { path, name, fullPath, query, params, meta } = tab;
    //   // 404  The page does not need to add a tab
    //   if (
    //     path === Page.ERROR_PAGE ||
    //     path === Page.BASE_LOGIN ||
    //     !name ||
    //     [PAGE_EXCEPT_NAME, REDIRECT_NAME, PAGE_NOT_FOUND_NAME].includes(name as string)
    //   ) {
    //     return;
    //   }

    //   let updateIndex = -1;
    //   // Existing pages, do not add tabs repeatedly
    //   const tabHasExits = this.tabs.some((tab, index) => {
    //     updateIndex = index;
    //     return tab.fullPath === fullPath;
    //   });

    //   // If the tab already exists, perform the update operation
    //   if (tabHasExits) {
    //     const curTab = toRaw(this.tabs)[updateIndex];
    //     if (!curTab) {
    //       return;
    //     }
    //     curTab.query = query || curTab.query;
    //     curTab.params = params || curTab.params;
    //     curTab.fullPath = fullPath || curTab.fullPath;
    //     this.tabs.splice(updateIndex, 1, curTab);
    //   } else {
    //     // Add tab
    //     // 获取动态路由打开数，超过 0 即代表需要控制打开数
    //     const dynamicLevel = meta?.dynamicLevel ?? -1;
    //     if (dynamicLevel > 0) {
    //       // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
    //       // 获取到已经打开的动态路由数, 判断是否大于某一个值
    //       if (
    //         this.tabs.filter((e) => e.fullPath ?? '' === fullPath).length >= dynamicLevel
    //       ) {
    //         // 关闭第一个
    //         const index = this.tabs.findIndex((item) => item.fullPath === fullPath);
    //         index !== -1 && this.tabs.splice(index, 1);
    //       }
    //     }
    //     this.tabs.push(tab);
    //   }
    //   this.updateCacheTab();
    // },

    /**
     * @param route tab route
     * @param active  Whether to activate the added tab
     * @returns 
     */
    addTab(route: RouteLocationNormalized, active: boolean = false) {
      const tab = toTabRoute(route);
      const { path, name, fullPath } = tab;
      // 404  The page does not need to add a tab
      if (
        path === Page.ERROR_PAGE ||
        path === Page.BASE_LOGIN ||
        !name ||
        [PAGE_EXCEPT_NAME, REDIRECT_NAME, PAGE_NOT_FOUND_NAME].includes(name as string)
      ) {
        return;
      }

      // Existing pages, do not add tabs repeatedly
      const tabHasExits = this.tabs.some(tab => tab.fullPath === fullPath);
      if (!tabHasExits) {
        this.tabs.push(tab);
        this.updateCacheTab();
      }
      if (active) {
        this.setActiveTab(tab.fullPath)
      }
    },

    async closeTab(tab: App.TabRoute, router: Router) {
      const close = (route: App.TabRoute) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) {
          return;
        }
        const index = this.tabs.findIndex((item) => item.fullPath === fullPath);
        if (index !== -1) {
          const delTabs = this.tabs.splice(index, 1);
          //删除对应的keep-alive缓存
          this.cachePages.delete(delTabs[0].name as string)
        }
      };

      const { currentRoute, replace } = router;

      const { path } = unref(currentRoute);
      if (path !== tab.path) {
        // Closed is not the activation tab
        close(tab);
        return;
      }

      // Closed is activated atb
      let toTarget: RouteLocationRaw = {};
      let activePath: string = ''
      const index = this.tabs.findIndex((item) => item.path === path);

      // If the current is the leftmost tab
      if (index === 0) {
        // There is only one tab, then jump to the homepage, otherwise jump to the right tab
        if (this.tabs.length === 1) {
          const { useUserStore } = await import('@/store/modules/user');
          const { getUserInfo } = useUserStore();
          toTarget = getUserInfo?.homePath || Page.BASE_HOME;
          activePath = toTarget as string
        } else {
          //  Jump to the right tab
          const page = this.tabs[index + 1];
          toTarget = getToTarget(page);
          activePath = page.fullPath
        }
      } else {
        // Close the current tab
        const page = this.tabs[index - 1];
        toTarget = getToTarget(page);
        activePath = page.fullPath
      }
      close(toTabRoute(unref(currentRoute)));
      this.setActiveTab(activePath)
      await replace(toTarget);
    },

    // Close according to key
    async closeTabByKey(key: string, router: Router) {
      const index = this.tabs.findIndex((item) => (item.fullPath || item.path) === key);
      if (index !== -1) {
        await this.closeTab(this.tabs[index], router);
        const { currentRoute, replace } = router;
        // 检查当前路由是否存在于tabList中
        const isActivated = this.tabs.findIndex((item) => {
          return item.fullPath === currentRoute.value.fullPath;
        });
        // 如果当前路由不存在于TabList中，尝试切换到其它路由
        if (isActivated === -1) {
          let pageIndex;
          if (index > 0) {
            pageIndex = index - 1;
          } else if (index < this.tabs.length - 1) {
            pageIndex = index + 1;
          } else {
            pageIndex = -1;
          }
          if (pageIndex >= 0) {
            const page = this.tabs[index - 1];
            const toTarget = getToTarget(page);
            await replace(toTarget);
            this.setActiveTab(page.fullPath)
          }
        }
      }
    },

    // Sort the tabs
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabs[oldIndex];
      this.tabs.splice(oldIndex, 1);
      this.tabs.splice(newIndex, 0, currentTab);
      this.lastDragEndIndex = this.lastDragEndIndex + 1;
    },


    // Close the tab on the right and jump
    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabs.findIndex((item) => item.path === route.path);

      if (index > 0) {
        const leftTabs = this.tabs.slice(0, index);
        const pathList: string[] = [];
        for (const item of leftTabs) {
          const affix = item?.meta?.affix ?? false;
          if (!affix) {
            pathList.push(item.fullPath);
          }
        }
        this.bulkCloseTabs(pathList);
      }
      this.updateCacheTab();
      handleGotoPage(router);
    },

    // Close the tab on the left and jump
    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabs.findIndex((item) => item.fullPath === route.fullPath);

      if (index >= 0 && index < this.tabs.length - 1) {
        const rightTabs = this.tabs.slice(index + 1, this.tabs.length);

        const pathList: string[] = [];
        for (const item of rightTabs) {
          const affix = item?.meta?.affix ?? false;
          if (!affix) {
            pathList.push(item.fullPath);
          }
        }
        this.bulkCloseTabs(pathList);
      }
      this.updateCacheTab();
      handleGotoPage(router);
    },

    async closeAllTab(router: Router) {
      this.tabs = this.tabs.filter((item) => item?.meta?.affix ?? false);
      this.clearCachePages();
      this.goToPage(router);
    },

    /**
     * Close other tabs
     */
    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const closePathList = this.tabs.map((item) => item.fullPath);

      const pathList: string[] = [];

      for (const path of closePathList) {
        if (path !== route.fullPath) {
          const closeItem = this.tabs.find((item) => item.path === path);
          if (!closeItem) {
            continue;
          }
          const affix = closeItem?.meta?.affix ?? false;
          if (!affix) {
            pathList.push(closeItem.fullPath);
          }
        }
      }
      this.bulkCloseTabs(pathList);
      this.updateCacheTab();
      handleGotoPage(router);
    },

    /**
     * Close tabs in bulk
     */
    async bulkCloseTabs(pathList: string[]) {
      this.tabs = this.tabs.filter((item) => !pathList.includes(item.fullPath));
    },

    /**
     * Set tab's title
     */
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.tabs.find((item) => item.fullPath === (route.fullPath || route.path));
      if (findTab) {
        findTab.meta.title = title;
        await this.updateCacheTab();
      }
    },
    /**
     * replace tab's path
     * **/
    async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
      const findTab = this.tabs.find((item) => item.fullPath === route.fullPath);
      if (findTab) {
        findTab.fullPath = fullPath;
        findTab.path = fullPath;
        await this.updateCacheTab();
      }
    },

    async handleTabClick(fullPath: string) {
      const { routerPush } = useRouterPush(false);
      const isActive = this.activeTab === fullPath;
      if (!isActive) {
        const navigationFailure = await routerPush(fullPath);
        if (!navigationFailure) this.setActiveTab(fullPath); //这个其实在监听部分已经做了
      }
    },

    /** 从缓存路由中去除某个路由 */
    removeCacheRoute(name: string) {
      const has = this.cachePages.has(name);
      if (has) {
        this.cachePages.delete(name);
      }
    },

    /** 添加某个缓存路由 */
    addCacheRoute(name: string) {
      const has = this.cachePages.has(name);
      if (!has) {
        this.cachePages.add(name);
      }
    },

    //缓存打开的tabs，保存到storage
    storeTabs() {
      persist && localStorage.set(ThemeCacheKey.TABS, this.tabs);
    },

    /**
   * 记录tab滚动位置
   * @param fullPath - 路由fullPath
   * @param position - tab当前页的滚动位置
   */
    recordTabScrollPosition(fullPath: string, position: { left: number; top: number }) {
      const index = findTabIndex(this.tabs, fullPath);
      if (index > -1) {
        this.tabs[index].scrollPosition = position;
      }
    },
    /**
     * 获取tab滚动位置
     * @param fullPath - 路由fullPath
     */
    getTabScrollPosition(fullPath: string) {
      const position = {
        left: 0,
        top: 0
      };
      const index = findTabIndex(this.tabs, fullPath);
      if (index > -1) {
        Object.assign(position, this.tabs[index].scrollPosition);
      }
      return position;
    },
  }
})
