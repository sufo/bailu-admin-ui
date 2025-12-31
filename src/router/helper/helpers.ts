/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-19 18:35:52
 * @Desc: 
 */
import { AppRouteRecordRaw } from "~/types/route";
import { LAYOUT, EXCEPTION_COMPONENT, PARENT_VIEW, getParentLayout } from "../routes";
import { warn } from '@/utils/log'
import { cloneDeep } from 'lodash-es'
import { treeMap } from '@/utils/tree'
import { isUrl } from '@/utils/util'
import { resolve } from '@/utils/path'
import { i18n } from "@/locales/i18n";
import { useIconRender } from "@/components/icon";
import { RouteRecordNormalized, RouteLocationNormalizedLoaded } from "vue-router";

//TODO
const IFRAME = () => import('@/layouts/iframe.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);
LayoutMap.set('PARENTVIEW', PARENT_VIEW);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// export function tranformRoute<T = AppRouteRecordRaw>(routes: AppRouteRecordRaw[]): T[] {
//   routes.forEach(route => {
//     const component = route.component as string
//     if (component) {
//       //顶级路由
//       if (component.toUpperCase() === 'LAYOUT'
//         || component.toUpperCase() === 'PARENTVIEW') {
//         route.component = LayoutMap.get(component.toUpperCase())
//       } else {
//         let path = component
//         if (component.startsWith("/"))
//           path = component.substring(1)
//         if (!component.endsWith(".vue") && !component.endsWith(".tsx"))
//           path = component + ".vue"
//         route.component = () => import(`@/views/${path}`)
//       }
//     } else {
//       warn('请正确配置路由：' + route?.name + '的component属性');
//     }
//     route.children && asyncImportRoute(route.children);
//   });
//   return routes as unknown as T[]
// }

export function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  //导入组件
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach(r => {
    if (!r.component && r.meta?.frameSrc) {
      r.component = 'IFRAME'
    }
    const { component, name, children } = r;

    if (component) {
      const layoutFound = LayoutMap.get((component as string).toUpperCase())
      if (layoutFound) {
        r.component = layoutFound
      } else {
        r.component = dynamicImport(dynamicViewsModules, component as string)
      }
    } else if (name) {
      r.component = getParentLayout(name)  //这里component是一个字符串，没有实际作用
    }
    children && asyncImportRoute(children);
  })
}

function dynamicImport(viewModules: Record<string, () => Promise<Recordable>>, component: string) {
  const keys = Object.keys(viewModules);
  //component路径匹配
  const matchKeys = keys.filter(key => {
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith("/");
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return viewModules[matchKey]
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

//route to menu
//注意route跟menu的处理不同，menu比较简单
// export function transformRouteToMenu(routeModList: AppRouteRecordRaw[]) {
//   let routeList = cloneDeep(routeModList);
//   //filter hide
//   // routeList = filter(routeList, (route: AppRouteRecordRaw) => {
//   //   const { meta } = route;
//   //   const { hide = false } = meta || {};
//   //   return !hide;
//   // })
//   // routeList = filterRoutes(routeList)

//   routeList = filterTree(routeList)

//   const list = treeMap<Menu, AppRouteRecordRaw>(routeList, {
//     conversion: (node: AppRouteRecordRaw) => {
//       const { meta: { title, hide = false } = {} } = node;
//       return {
//         ...(node.meta || {}),
//         meta: node.meta,
//         name: title,
//         hide,
//         path: node.path,
//         ...(node.redirect ? { redirect: node.redirect } : {}),
//       };
//     },
//   });
//   joinParentPath(list);
//   return cloneDeep(list);
// }


//route to menu
//保持结构层级
export function transformRouteToMenu(routeModList: AppRouteRecordRaw[]) {
  let routeList = cloneDeep(routeModList);
  //filter hide
  routeList = filterTree(routeList)
  const { iconRender } = useIconRender()
  const list: App.Menu[] = treeMap<App.Menu, AppRouteRecordRaw>(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      // const { meta: { title } = {} } = node;
      const { meta } = node;
      const title = meta.i18nKey ? i18n.global.t(meta.i18nKey) : (meta.title || "");
      const icon = iconRender({ icon: node.meta?.icon as string });
      return {
        name: title,
        routeName: node.name,
        path: node.path,
        key: node.name,   //route name
        label: title,     // titile
        query: node.meta.query,
        icon,   // naive ui menu icon
        //...(node.redirect ? { redirect: node.redirect } : {}), //重定向在路由处理即可
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}


function joinParentPath(menus: App.Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      // joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.routePath);
      joinParentPath(menu.children, menu.path);
    }
  }
}


/** 过滤meta中hide为true的菜单 */
function filterTree(data: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  const newTree = cloneDeep(data).filter(
    ({ meta: { hide = false } }) => !hide
  );
  // newTree.forEach(
  //   r=>(r.children && !r.meta.hideChildrenInMenu) && (r.children = filterTree(r.children))
  // );
  // return newTree;

  return newTree.map(r => {
    if (r.children) {
      //hideChildrenInMenu=true,说明是顶层菜单，但是后台处理增加了一层菜单，这里还原回来
      if (r.meta.hideChildrenInMenu) {
        // r.children[0].path = r.path  //采用父级path
        r.children[0].path = `${r.path}/${r.children[0].path}`  //采用父级path
        return r.children[0]
      } else {
        const { children, ...rest } = r
        return {
          ...rest,
          children: filterTree(children)
        }
      }
    } else return r
  })
}


/** 过滤children长度为0的的目录，当目录下没有菜单时，会过滤此目录*/
//@ts-ignore
function filterRoutes(data: AppRouteRecordRaw[]) {
  const newTree = cloneDeep(data).filter((v: any) => v?.children?.length !== 0 && !v.meta.hide);
  newTree.forEach(
    r => r.children && (r.children = filterTree(r.children))
  );
  return newTree;
}


// 将多层嵌套路由处理成两层，保留顶层和最子层路由，中间层级将被拍平
//超过两级路由存在缓存问题
export function flatAsyncRoutes<T extends AppRouteRecordRaw>(routes: T[]) {

  routes.forEach(route => {
    if (route.children) {
      // route.children = flatAsyncRoutesRecursive(route.children, route.path)
      route.children = flatAsyncRoutesRecursive(route.children, "")
    }
  })
}
function flatAsyncRoutesRecursive(routes: AppRouteRecordRaw[], baseUrl = ''): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = []
  routes.forEach((route) => {
    if (route.children) {
      // const childrenBaseUrl = resolveRoutePath(baseUrl, route.path)
      const childrenBaseUrl = joinPath(baseUrl, route.path)
      const tmpRoute = cloneDeep(route)
      tmpRoute.path = childrenBaseUrl
      delete tmpRoute.children
      res.push(tmpRoute)
      // debugger
      const childrenRoutes = flatAsyncRoutesRecursive(route.children, childrenBaseUrl)
      childrenRoutes.forEach((item) => {
        // 如果 path 一样则覆盖，因为子路由的 path 可能设置为空，导致和父路由一样，直接注册会提示路由重复
        if (res.some(v => v.path === item.path)) {
          res.forEach((v, i) => {
            if (v.path === item.path) {
              res[i] = item
            }
          })
        }
        else res.push(item)
      })
    }
    else {
      const tmpRoute = cloneDeep(route)
      // tmpRoute.path = resolveRoutePath(baseUrl, tmpRoute.path)
      tmpRoute.path = joinPath(baseUrl, tmpRoute.path)
      res.push(tmpRoute)
    }
  })
  return res
}


export function resolveRoutePath(basePath: string, routePath?: string) {
  return basePath ? resolve(basePath, routePath ?? '') : routePath ?? ''
}

export function joinPath(basePath: string, routePath?: string) {
  routePath = routePath ?? ''
  return basePath ? basePath + (routePath.startsWith("/") ? routePath : '/' + routePath) : routePath
}


/**
* 根据vue路由获取tab路由
* @param route
*/
export function toTabRoute(route: RouteRecordNormalized | RouteLocationNormalizedLoaded) {
  const fullPath = hasFullPath(route) ? route.fullPath : route.path;
  const tabRoute: App.TabRoute = {
    name: route.name,
    path: route.path,
    fullPath,
    query: (route as RouteLocationNormalizedLoaded).query || {},
    params: (route as RouteLocationNormalizedLoaded).params || {},
    meta: route.meta,
    scrollPosition: {
      left: 0,
      top: 0
    }
  };
  return tabRoute;
}
/**
* 判断路由是否有fullPath属性
* @param route 路由
*/
function hasFullPath(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded
): route is RouteLocationNormalizedLoaded {
  return Boolean((route as RouteLocationNormalizedLoaded).fullPath);
}
