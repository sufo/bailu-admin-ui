
/**
* 获取当前路由所在菜单数据的paths
* @param activeKey - 当前路由的key
* @param menus - 菜单数据
*/
export function getActiveKeyPathsOfMenus(activeKey: string, menus: App.Menu[]) {
  const keys = menus.map(menu => getActiveKeyPathsOfMenu(activeKey, menu)).flat(1);
  return keys;
}

function getActiveKeyPathsOfMenu(activeKey: string, menu: App.Menu) {
  const keys: string[] = [];
  if (activeKey.startsWith(menu.routeName)) {
    keys.push(menu.routeName);
  }
  if (menu.children) {
    keys.push(...menu.children.map(item => getActiveKeyPathsOfMenu(activeKey, item as App.Menu)).flat(1));
  }
  return keys;
}
