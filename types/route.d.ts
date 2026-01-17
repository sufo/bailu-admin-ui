/** 权限路由相关类型 */
import type { Component } from 'vue';
import type { RouteMeta, RouteRecord, RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string,
  meta: RouteMeta,
  component?: Component | string,
  children?: AppRouteRecordRaw[],
  props?: Recordable
  fullPath?: string;
}

/** 菜单项配置 
 *  depreacted
 *  为了配合naive-ui的menu类型，使用business.d.ts下面的 App.Menu
*/
// export interface Menu {
//   name: string;

//   icon?: string;

//   path: string;

//   // path contains param, auto assignment.
//   // paramPath?: string;
//   //路由参数
//   query?: string

//   //菜单类型
//   type?: string

//   enable?: boolean;

//   children?: Menu[];

//   // sort?: number;

//   meta?: Partial<RouteMeta>;

//   // hide?: boolean;
// }


declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    // orderNo?: number;
    title: string;

    i18nKey?: string;

    ignoreAuth?: boolean;
    // icon on tab
    icon?: string;
    frameSrc?: string;
    // Is it fixed on tab
    affix?: boolean;
    isFrame?: boolean;
    KeepAlive?: boolean;
    // role info
    /**
    * 哪些类型的用户有权限才能访问的路由(空的话则表示不需要权限)
    * @description 后端动态路由数据不需要该属性，直接由后端根据用户角色返回对应权限的路由数据
    */
    roles?: RoleType[];
    /** 是否在菜单中隐藏(一些列表、表格的详情页面需要通过参数跳转，所以不能显示在菜单中) */
    hide?: boolean;
    /** 动态路由可打开的数量 */
    dynamicLevel?: number;
    // Currently active menu 比如当前页还能跳转子页面，但是子页面是不展示菜单的，此时就需要指定活动的menu
    activeMenu?: string;
    //query
    query?: string;

    //隐藏子菜单
    hideChildrenInMenu?: boolean
  }
}