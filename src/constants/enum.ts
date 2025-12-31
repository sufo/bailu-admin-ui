export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}

// theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

/** 多页签风格 */
// export enum TabModeEnum {
//   'chrome' = '谷歌风格',
//   'button' = '按钮风格'
// }


/** 过渡动画类型 */
export enum AnimateModeEnum {
  'zoom-fade' = '渐变',
  'zoom-out' = '闪现',
  'fade-slide' = '滑动',
  'fade' = '消退',
  'fade-bottom' = '底部消退',
  'fade-scale' = '缩放消退'
}


export enum ThemeCacheKey {
  THEME_SETTINGS = '__THEME_SETTINGS__',
  THEME_COLOR = '__THEME_COLOR__',
  TABS = '__TABS__'
}


export enum Page {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/dashboard',

  // error page path
  ERROR_PAGE = '/exception',
  //404
  NOT_FOUND = "all"
}


/**
 * @description: request method
 */
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ContentType {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',

}

/**
 * 自定义逻辑响应码
 */
export enum ResultCode {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success',
}

//登录模块
export enum LoginModule {
  LOGIN = 'login.signIn',
  REGISTER = 'login.signUp',
  RESET_PASSWORD = 'login.forget',
  MOBILE = 'login.mobileSignIn',
  WECHAT = 'login.wechatSignIn'
}

/** 用户角色 */
export enum RoleEnum {
  // super admin
  SUPER = 'super',

  // tester
  TEST = 'test',
}