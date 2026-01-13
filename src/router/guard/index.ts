import { Router } from "vue-router";
import { setRouteChange } from "./routeChange";
import { AxiosCanceler } from "@/http/axiosCanceler";
import { RouteLocationNormalized } from 'vue-router'
import { warn } from "@/utils/log";
import { useTitle } from '@vueuse/core'
import { useUserStoreWidthOut } from "@/store/modules/user";
import { i18n } from "@/locales/i18n";
import setting from "@/settings/projectSetting";
import { Page } from "@/constants/enum";
import { useAsyncRouteStore } from "@/store/modules/route";
import { ROOT_ROUTE } from "../routes";

const ROOT_PATH = ROOT_ROUTE.path;
/**
 * @param router 
 * 路由守卫
 */
// Don't change the order of creation
export function setupRouteGuard(router: Router) {
  createPageCuard(router);
  createHttpGuard(router);
  createScrollGuard(router);
  // createMessageGuard(router);
  createRouterGuard(router);
  createPermissionGuard(router);
}

/**
 * Hooks for handling page state
 */
function createPageCuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async to => {
    // The page has already been loaded, it will be faster to open it again, you don’t need to do loading and other processing
    //TODO
    to.meta.loaded = !!loadedPageMap.get(to.path)
    //notify routing changes
    setRouteChange(to);
    return true;
  })

  router.afterEach(to => {
    loadedPageMap.set(to.path, true)
  })
}


/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
function createHttpGuard(router: Router) {
  //TODO
  let removeAllHttpPending = true;
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    axiosCanceler?.removeAllPending();
    return true;
  })
}

// Routing switch back to the top
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href);
  };
  const body = document.body

  router.afterEach(async to => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
  })
}

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = setting.app;

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        // NModal.destroyAll();
        window.$dialog?.destroyAll()
        window.$notification?.destroyAll();
      }
    } catch (error) {
      warn('message guard error:' + error);
    }
    return true;
  });
}

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();
    next()
  });
  router.afterEach(to => {
    if (setting.app.dynamicTitle) {
      // 设置document title
      let titleObj = (to.meta as { i18nKey: string, title: string })
      useTitle(titleObj.i18nKey ? i18n.global.t(titleObj.i18nKey) : titleObj.title);
      // useTitle(i18n.global.t((to.meta as { title: string })?.title));
      // 结束 loadingBar
    }
    window.$loadingBar?.finish();
  });
}

const LOGIN_PATH = Page.BASE_LOGIN;
const whitePathList = [LOGIN_PATH]; // no redirect whitelist
//权限
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWidthOut()
  const asyncRouteStore = useAsyncRouteStore()

  function redirectData(to: RouteLocationNormalized) {
    const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
      path: LOGIN_PATH,
      replace: true
    };
    if (to.path) {
      redirectData.query = {
        ...redirectData.query,
        redirect: to.path
      }
    }
    return redirectData
  }

  router.beforeEach(async (to, from, next) => {

    //直接进首页首先定位到homePath
    if (
      from.path === ROOT_PATH &&
      to.path === Page.BASE_HOME &&
      userStore.getUserInfo?.homePath &&
      userStore.getUserInfo.homePath !== Page.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath || Page.BASE_HOME);
      return;
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as Page)) {
      next();
      return;
    }

    const token = userStore.getToken

    // token does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // Allow static assets to pass through (likely to be 404s, but better than login redirect)
      if (/\.(png|jpg|jpeg|gif|svg|ico)$/i.test(to.path)) {
        next();
        return;
      }

      // redirect login page
      next(redirectData(to));
      return;
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === Page.NOT_FOUND &&
      to.fullPath !== (userStore.getUserInfo?.homePath || Page.BASE_HOME)
    ) {
      next(userStore.getUserInfo?.homePath || Page.BASE_HOME);
      return;
    }

    // get userinfo while last fetch time is empty
    if (userStore.lastUpdTime === 0) {
      try {
        await userStore.reqUserInfo();
        console.log('reqUserInfo', 'success')
      } catch (err) {
        console.log('reqUserInfo-err', err)
        next(redirectData(to));
        return;
      }
    }
    //如果已处理动态路由
    if (asyncRouteStore.isDynamicAddedRoute) {
      next()
      return;
    }

    //初始化路有
    try {
      await asyncRouteStore.initRoute(userStore.getUserInfo?.homePath || Page.BASE_HOME)
    } catch (err) {
      console.log('initRoute', err)
      next()
      return
    }

    if (to.name === Page.NOT_FOUND) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  })
}
