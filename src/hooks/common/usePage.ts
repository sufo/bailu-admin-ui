
import type { RouteLocationRaw, Router } from "vue-router"
import { LoginModule, Page } from '@/constants/enum'
import { isString,isUrl } from "@/utils/util";
import { useRouter } from 'vue-router';
import { router as globalRouter } from '@/router';
import { PAGE_ROOT_NAME } from "@/router/routes";
import { PAGE_LOGIN_NAME } from "@/router/routes";

function handleError(e: Error) {
  console.error(e);
}

// page switch
export function useGo(_router?: Router) {

  const { push, replace } = _router || useRouter();
  function go(opt: Page | RouteLocationRaw | string = Page.BASE_HOME, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}


/**
 * 路由跳转
 * @param inSetup - 是否在vue页面/组件的setup里面调用，在axios里面无法使用useRouter和useRoute
 */
export function useRouterPush(inSetup = true) {
  const router =  inSetup ? useRouter() : globalRouter;
  const route = globalRouter.currentRoute;

  /**
   * 路由跳转
   * @param to - 需要跳转的路由
   * @param newTab - 是否在新的浏览器Tab标签打开
   */
  function routerPush(to: RouteLocationRaw, newTab = false) {
    if (newTab) {
      const routerData = router.resolve(to);
      window.open(routerData.href, '_blank');
      return Promise.resolve();
    }else if(isUrl(to as string)){
      window.open(to as string, '_blank');
      return Promise.resolve();
    }
    return router.push(to);
  }

  /** 返回上一级路由 */
  function routerBack() {
    router.go(-1);
  }

  /**
   * 跳转首页
   * @param newTab - 在新的浏览器标签打开
   */
  function toHome(newTab = false) {
    routerPush({ name: PAGE_ROOT_NAME }, newTab);
  }

  /**
   * 跳转登录页面
   * @param loginModule - 展示的登录模块
   * @param redirectUrl - 重定向地址(登录成功后跳转的地址),默认undefined表示取当前地址为重定向地址
   */
  function toLogin(loginModule?: LoginModuleKey, redirectUrl?: string) {
    const module: LoginModuleKey = loginModule || Object.keys(LoginModule)[0] as LoginModuleKey;
    const routeLocation: RouteLocationRaw = {
      name: PAGE_LOGIN_NAME,
      params: { module }
    };
    const redirect = redirectUrl || route.value.fullPath;
    Object.assign(routeLocation, { query: { redirect } });
    routerPush(routeLocation);
  }

  /**
   * 登录页切换其他模块
   * @param module - 切换后的登录模块
   */
  function toLoginModule(module: LoginModuleKey) {
    const { query } = route.value;
    routerPush({ name: PAGE_LOGIN_NAME, params: { module }, query });
  }

  //vue-router 4.1.4 (2022-08-22)  params传递参数失效，采用query
  // function toLoginModule(module: LoginModuleKey) {
  //   const { query } = route.value;
  //   const q = Object.assign({}, query, {module})
  //   router.push({name: "login", query:q, })
  // }

  /**
   * 登录成功后跳转重定向的地址
   */
  function toLoginRedirect() {
    const { query } = route.value;
    if (query?.redirect) {
      routerPush(query.redirect as string);
    } else {
      toHome();
    }
  }

  return {
    routerPush,
    routerBack,
    toHome,
    toLogin,
    toLoginModule,
    toLoginRedirect
  };
}
