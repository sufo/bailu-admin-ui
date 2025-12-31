import { AppRouteRecordRaw } from "~/types/route";
//并没有实际作用，只是配合提示
// import { t } from '@/locales/i18n'
import { Page } from '@/constants/enum'

export const PAGE_ROOT_NAME = 'Home'

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const PAGE_EXCEPT_NAME = 'exceptionPage';

export const PAGE_LOGIN_NAME = 'login'

export const EXCEPTION_COMPONENT = () => import('@/views/exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layouts/default/index.vue');

export const PARENT_VIEW = () => import('@/layouts/ParentView.vue');

/**根路由 */
// export const ROOT_ROUTE: AppRouteRecordRaw = {
//   name: PAGE_ROOT_NAME,
//   path: '/',
//   // redirect: Page.BASE_HOME,
//   meta: {
//     title: t('menu.home'),
//     i18nTitle: t('menu.home')
//   },
//   component: LAYOUT
// }
export const ROOT_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: Page.BASE_HOME,
  meta: {
    title: 'Root',
  },
  component: LAYOUT
};

/**login */

export const LOGIN_ROUTE: AppRouteRecordRaw = {
  name: 'login',
  // path: '/login/:module?',  //可选动态路由
  path: '/login',
  component: () => import('@/views/login/login.vue'),
  //vue-router 4.1.4+  Discarded invalid param(s)
  //@ts-ignore   
  // props: route => {
  //   const moduleType = (route.params.module as LoginModuleKey);
  //   return {
  //     module: moduleType
  //   };
  // },
  meta: {
    // title: t('login.loginButton'),
    title: 'login',
    // i18nTitle: t('login.loginButton'),
    i18nKey: 'login.loginButton'
  }
}

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/layouts/redirect.vue'),
      meta: {
        title: REDIRECT_NAME,
        // hideBreadcrumb: true,
      },
    },
  ],
};


//error
// export const PAGE_NOT_FOUND: AppRouteRecordRaw = {
//   path: '/:path(.*)*',
//   name: PAGE_EXCEPT_NAME,
//   component: LAYOUT,
//   meta: {
//     title: PAGE_EXCEPT_NAME
//   },
//   children: [
//     // 匹配无效路径的路由
//     {
//       name: PAGE_NOT_FOUND_NAME,
//       path: '/:path(.*)*',
//       component: EXCEPTION_COMPONENT,
//       meta: {
//         title: 'not-found',
//       }
//     }
//   ],
// };

//local dynamic routes
// export const localDynamicRoutes: AppRouteRecordRaw = {
//   path: '/sytem',
//   component: LAYOUT,
//   name:'System',
//   meta:{hideMenu: true,title:""}
// }

//error
// export const PAGE_EXCEPT: AppRouteRecordRaw = {
//   path: '/',
//   // path: '/:pathMatch(.*)*',
//   name: PAGE_EXCEPT_NAME,
//   component: LAYOUT,
//   meta: {
//     title: PAGE_EXCEPT_NAME,
//     hideMenu: true,
//   },
//   children: [
//     {
//       name: PAGE_EXCEPT_NAME,
//       path: ':status(\\d+)',
//       component: EXCEPTION_COMPONENT,
//       meta: {
//         title: 'ErrorPage',
//         // i18nKey: t('menu.except'),
//         i18nKey: 'menu.except',
//         hideMenu: true,
//       }
//     },
//     // 匹配无效路径的路由
//     {
//       name: PAGE_NOT_FOUND_NAME,
//       path: '/:pathMatch(.*)*',
//       component: EXCEPTION_COMPONENT,
//       meta: {
//         title: 'not-found',
//         // i18nTitle: t('menu.notFound'),
//         i18nKey: 'menu.notFound',
//         hideMenu: true,
//       }
//     }
//   ],
// };


export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'ErrorLogList',
      component: () => import('@/views/error-log/index.vue'),
      meta: {
        title: 'error logs',
        // i18nTitle: t('menu.errorLogList'),
        i18nKey: 'menu.errorLogList',
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};

export const PROFILE: AppRouteRecordRaw = {
  path: '/user',
  name: 'UserProfile',
  component: LAYOUT,
  meta: { title: 'User' },
  children: [
    {
      path: 'profile',
      name: 'Profile',
      component: () => import('@/views/sys/profile/index.vue'),
      meta: {
        title: 'Profile',
        i18nKey: 'page.profile.title'
      }
    }
  ]
}

// 匹配无效路径的路由
export const NOT_FOUND: AppRouteRecordRaw = {
  name: PAGE_NOT_FOUND_NAME,
  path: '/:pathMatch(.*)*',
  component: EXCEPTION_COMPONENT,
  meta: {
    title: 'not-found',
    // i18nTitle: t('menu.notFound'),
    i18nKey: 'menu.notFound',
    hideMenu: true,
  }
}

// Basic routing without permission
export const basicRoutes = [
  LOGIN_ROUTE,
  ROOT_ROUTE,
  REDIRECT_ROUTE,
  PROFILE,
  ERROR_LOG_ROUTE,
  // NOT_FOUND
];

// export const dynamicRoutes = [
//   PROFILE,
// ]

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: _name || PARENT_LAYOUT_NAME,
      });
    });
};