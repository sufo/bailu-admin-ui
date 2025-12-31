import { RouteLocationNormalizedLoaded } from "vue-router";

// @ts-ignore
export function getBreadcrumbByRoute(route: RouteLocationNormalizedLoaded, menus: App.Menu[], rootPath: string = "/") {
  const matched = route.matched
  const activeKeys = matched ? route.matched.map(item => item.name) as string[] : []

  const breadcrumbMenu: App.Menu[] = [];
  menus.some(menu => {
    const flag = activeKeys.includes(menu.key);
    if (flag) {
      breadcrumbMenu.push(...getBreadcrumbMenuFlat(route.name as string, activeKeys, menu));
    }
    return flag;
  });
  // console.log('breadcrumbMenu', breadcrumbMenu)
  if (breadcrumbMenu.length > 0) {
    return breadcrumbMenu.map(item => transformBreadcrumbMenuToBreadcrumb(item, rootPath));
  } else return []
}

/**
 * 根据单个菜单数据获取面包屑格式的菜单
 * @param activeKeys - 当前页面路由对应matched
 * @param menu - 单个菜单数据
 */
function getBreadcrumbMenuFlat(activeKey: string, activeKeys: string[], menu: App.Menu) {
  const breadcrumbMenu: App.Menu[] = [];
  if (activeKey === menu.key) {
    breadcrumbMenu.push(menu);
  }
  if (activeKeys.includes(menu.key) && menu.children && menu.children.length) {
    breadcrumbMenu.push(menu);
    breadcrumbMenu.push(
      ...menu.children.map(item => getBreadcrumbMenuFlat(activeKey, activeKeys, item as App.Menu)).flat(1)
    );
  }
  return breadcrumbMenu;
}



/**
 * 获取面包屑数据
 * @param activeKey - 当前页面路由的key
 * @param menus - 菜单数据
 * @param rootPath - 根路由路径
 */
export function getBreadcrumbByRouteKey(activeKey: string, menus: App.Menu[], rootPath: string) {
  const breadcrumbMenu = getBreadcrumbMenu(activeKey, menus);
  const breadcrumb = breadcrumbMenu.map(item => transformBreadcrumbMenuToBreadcrumb(item, rootPath));
  return breadcrumb;
}

/**
 * 根据菜单数据获取面包屑格式的菜单
 * @param activeKey - 当前页面路由的key
 * @param menus - 菜单数据
 */
function getBreadcrumbMenu(activeKey: string, menus: App.Menu[]) {
  const breadcrumbMenu: App.Menu[] = [];
  menus.some(menu => {
    const flag = activeKey.includes(menu.key);
    if (flag) {
      breadcrumbMenu.push(...getBreadcrumbMenuItem(activeKey, menu));
    }
    return flag;
  });
  return breadcrumbMenu;
}

/**
 * 根据单个菜单数据获取面包屑格式的菜单
 * @param activeKey - 当前页面路由的key
 * @param menu - 单个菜单数据
 */
function getBreadcrumbMenuItem(activeKey: string, menu: App.Menu) {
  const breadcrumbMenu: App.Menu[] = [];
  if (activeKey === menu.key) {
    breadcrumbMenu.push(menu);
  }
  if (activeKey.includes(menu.key) && menu.children && menu.children.length) {
    breadcrumbMenu.push(menu);
    breadcrumbMenu.push(
      ...menu.children.map(item => getBreadcrumbMenuItem(activeKey, item as App.Menu)).flat(1)
    );
  }

  return breadcrumbMenu;
}

/**
 * 将面包屑格式的菜单数据转换成面包屑数据
 * @param menu - 单个菜单数据
 * @param rootPath - 根路由路径
 */
function transformBreadcrumbMenuToBreadcrumb(menu: App.Menu, rootPath: string) {
  const hasChildren = Boolean(menu.children && menu.children.length);
  const breadcrumb: App.Breadcrumb = {
    key: menu.key,
    label: menu.label as string,
    disabled: menu.routePath === rootPath,
    hasChildren,
    i18nKey: menu.i18nKey
  };
  if (menu.icon) {
    breadcrumb.icon = menu.icon;
  }
  if (hasChildren) {
    breadcrumb.options = menu.children?.map(item =>
      transformBreadcrumbMenuToBreadcrumb(item as App.Menu, rootPath)
    ) as NonNullable<App.Breadcrumb['options']>;
  }
  return breadcrumb;
}
