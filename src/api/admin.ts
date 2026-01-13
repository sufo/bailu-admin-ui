
import { http } from '@/http/index'

import { AppRouteRecordRaw } from '#/route'
import { UploadFileParams } from '~/types/axios';
import { AxiosRequestConfig, AxiosProgressEvent } from 'axios'
import { TreeSelectOption } from 'naive-ui/lib';
import type { TagOption } from '@/components/custom/dynamic-tags/types';
/**======================login======================= */
/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.get<UserInfo>({ url: '/user/info' }, { errorMsgMode: 'none' });
}

/**
 * 获取验证码
 * @param phone - 手机号
 */
export function smsCode(phone: string, dialCode?: string) {
  return http.get<string>({ url: '/sms', params: { phone, dialCode } })
}


export function login(params: LoginParams) {
  return http.post<UserState>({ url: "/login", data: params })
}

export function smsLogin(phone: string, smsCode: string) {
  return http.post<UserState>({ url: "/sms-login", params: { phone, smsCode } })
}
//获取验证码
export function getCaptcha() {
  return http.get({ url: "/captcha" })
}

export function logoutApi() {
  return http.post({ url: "/user/logout" })
}

//用户注册
export function register(params: RegisteParams) {
  return http.post({ url: "/user/register", data: params })
}

//是否被占用
export function userIsExist(name: string, ...val: string[]) {
  const valStr = val.join("/")
  return http.get<number>({ url: `/user/${name}/${valStr}` })
}

export function resetPwd(params: ResetParams) {
  return http.patch({ url: '/user/resetPassword', data: params })
}

//锁屏
export function unLock(username: string, password: string) {
  return http.post<UserState>({ url: '/unlock', data: { username, password } })
}

/**========================== user ============================ */
export const userApi = {
  //首页列表
  index: (params: Recordable) => {
    return http.get<PagesResult<User[]>>({ url: "/user", params })
  },
  status: (id: number | string, status: number | string) => {
    return http.patch({ url: "/user/status", data: { id, status } });
  },
  edit: (params: Recordable) => {
    return http.put({ url: "/user", params });
  },
  remove: (userId: number | string) => {
    return http.delete({ url: `/user/${userId}` });
  },
  create: (params: Recordable) => {
    return http.post({ url: "/user", params });
  },
  resetPwd: (id: number | string, password: string) => {
    return http.patch({ url: "/user/password", data: { id, password } });
  },

  changePwd: (id: number | string, password: string, newPassword: string) => {
    return http.patch({ url: "/user/changePwd", data: { id, password, newPassword } });
  },
  editProfile: (info: Recordable) => {
    return http.put<UserInfo>({ url: "/user/profile", data: info }, { successMsgMode: 'message' });
  },
  uploadAvatar(params: UploadFileParams) {
    return http.uploadFile({ url: '/user/avatar' }, params)
  }
}

/**========================== user end==========================*/


/**====================== menu ======================= */
export const menuApi = {
  index: (params: Recordable) => {
    return http.get<MenuVo[]>({ url: "/menu", params })
  },
  getMenusExcludeButton: (params: Recordable) => {
    return http.get<MenuVo[]>({ url: "/menu/menus", params })
  },
  //路由
  getRoutes: () => {
    return http.get<AppRouteRecordRaw[]>({ url: "/menu/routes" })
  },
  remove: (menuId: number) => {
    return http.delete({ url: `/menu/${menuId}` })
  },
  edit: (params: Recordable) => {
    return http.patch({ url: '/menu', params })
  },
  create: (params: Recordable) => {
    return http.post({ url: '/menu', params })
  },
  tree: () => {
    return http.get({ url: `/menu/tree` })
  },
  //菜单和角色对应的菜单ids
  treeSelect: (roleId: number | string) => {
    return http.get({ url: `/menu/tree/${roleId}` })
  },
}


// export function getMenus(params: Recordable) {
//   return http.get<MenuVo[]>({ url: "/menu", params })
// }
// export function getMenusExcludeButton(params: Recordable) {
//   return http.get<MenuVo[]>({ url: "/menu/menus", params })
// }
// //路由
// export function getRoutes() {
//   return http.get<AppRouteRecordRaw[]>({ url: "/menu/routes" })
// }

// export function delMenu(menuId:number){
//   return http.delete({url: `/menu/${menuId}`})
// }

// export function editMenu(params: Recordable){
//   return http.patch({url:'/menu', params})
// }
// export function createMenu(params: Recordable){
//   return http.post({url:'/menu', params})
// }

// export function getRoleMenus(roleId:number|string){
//   return http.get({url: `/menu/roleMenus/${roleId}`})
// }

// export function treeSelect(){
//   return http.get({url: "/menu/treeSelect"})
// }
/**============================menu end==============================*/

/**============================dept==============================*/
// export function getDepts(params: Recordable) {
//   return http.get<Dept[]>({ url: "/dept", params })
// }
// export function delDept(deptId: string|number) {
//   return http.delete({ url: `/dept/${deptId}` })
// }
// export function editDept(params: Recordable) {
//   return http.patch({ url: `/dept`,params })
// }
// export function createDept(params: Recordable) {
//   return http.post({ url: `/dept`,params })
// }
// export function getDeptTree(){
//   return http.get({url: '/dept/treeSelect'})
// }

export const deptApi = {
  index: (params: Recordable) => {
    return http.get<Dept[]>({ url: "/dept", params })
  },
  remove: (deptId: string | number) => {
    return http.delete({ url: `/dept/${deptId}` })
  },
  edit: (params: Recordable) => {
    return http.patch({ url: `/dept`, params })
  },
  create: (params: Recordable) => {
    return http.post({ url: `/dept`, params })
  },
  tree: () => http.get({ url: '/dept/tree' }),

  treeSelect: (roleId: number | string) => {
    return http.get({ url: `/dept/tree/${roleId}` })
  }
}

/**============================dept end==============================*/

/**===========================role=================================== */

export const roleApi = {

  index: <T = PagesResult<Role[]>>(params: Recordable) => {
    return http.get<T>({ url: "/role", params })
  },
  remove: (roleId: number | string) => {
    return http.delete({ url: `/role/${roleId}` })
  },
  edit: (params: Recordable) => {
    return http.put({ url: `/role`, data: params })
  },
  create: (params: Recordable) => {
    return http.post({ url: "/role", data: params })
  },
  status: (id: number | string, status: number | string) => {
    return http.patch({ url: "/role/status", data: { id, status } });
  },
  dataScope: (params: Recordable) => {
    return http.patch({ url: '/role/dataScope', data: params })
  },
  options: () => http.get({ url: '/role/options' }),
}

/**============================role end==============================*/


/**===========================post=================================== */
export const postApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<Post[]>>({ url: "/post", params })
  },
  remove: (id: number | string) => {
    return http.delete({ url: `/post/${id}` })
  },
  edit: (params: Recordable) => {
    return http.put({ url: `/post`, data: params })
  },
  create: (params: Recordable) => {
    return http.post({ url: "/post", data: params })
  },
  options: () => http.get({ url: '/post/options' }),
}

/**字典 */
export const dictApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<Dict[]>>({ url: "/dict", params })
  },
  remove: (code: string) => {
    return http.delete({ url: `/dict/${code}` })
  },
  edit: (params: Recordable) => {
    return http.put({ url: `/dict`, data: params })
  },
  create: (params: Recordable) => {
    return http.post({ url: "/dict", data: params })
  },

  //items
  dictItems: (code: string, params: Recordable) => {
    return http.get<PagesResult<DictItem[]>>({ url: `/dict/${code}` })
  },
  itemCreate: (data: Recordable) => {
    return http.post({ url: "/dictItem", data })
  },
  itemEdit: (data: Recordable) => {
    return http.put({ url: "/dictItem", data })
  },
  itemRemove: (id: string | number) => {
    return http.delete({ url: `/dict/${id}` })
  },
  itemStatus: (id: number | string, status: number | string) => {
    return http.patch({ url: "/dictItem/status", data: { id, status } });
  },
  // options: (dictCode: string)=>http.get({url: '/dictItem/options', params:{dictCode}}),
}


//operation record
export const operationApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<Operation[]>>({ url: "/oper", params })
  },
  remove: (ids: number | string) => {
    return http.delete({ url: `/oper/${ids}` })
  },
}


export const loginLogApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<LoginLog[]>>({ url: "/loginLog", params })
  },
  remove: (ids: string) => {
    return http.delete({ url: `/loginLog/${ids}` })
  },
  clean: () => http.delete({ url: "/loginLog/clean" }),
  findByUsername: () => http.get<LoginLog | null>({ url: '/loginLog/findByUsername' }),
}

export const onlineApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<OnlineUser[]>>({ url: "/online", params })
  },
  kickout: (ids: string) => {
    return http.delete({ url: `/online/${ids}` })
  },
}

export const noticeApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<Notice[]>>({ url: "/notice", params })
  },
  create: (params: Notice) => {
    return http.post({ url: "/notice", data: params })
  },
  edit: (params: Recordable) => {
    return http.put({ url: `/notice`, data: params })
  },
  remove: (ids: string) => {
    return http.delete({ url: `/notice/${ids}` })
  },
}

export const serverInfoApi = {
  index: () => {
    return http.get<ServerInfo>({ url: "/server" })
  },
}

export const taskApi = {
  index: (params: Recordable) => {
    return http.get<PagesResult<Task[]>>({ url: "/task", params })
  },
  create: (params: Recordable) => {
    return http.post({ url: "/task", data: params })
  },
  edit: (params: Recordable) => {
    return http.put({ url: `/task`, data: params })
  },
  //获取task详细信息
  info: (id: number) => {
    return http.get<Task>({ url: `/task/${id}` })
  },
  remove: (ids: string) => {
    return http.delete({ url: `/task/${ids}` })
  },

  status: (id: number | string, status: number | string) => {
    return http.patch({ url: `/task/${id}/${status}` });
  },
  jobs: () => {
    return http.get<OptionWithKey<string>[]>({ url: "/task/jobs" })
  },
  invoke: (id: string | number) => {
    return http.post({ url: `/task/invoke/${id}` })
  },

  //tasklog
  logs: (taskId: number, params: Recordable) => {
    return http.get<PagesResult<TaskLog[]>>({ url: `/task/${taskId}/logs`, params })
  },
  removeLogs: (ids: string) => {
    return http.delete({ url: `task/log/${ids}` })
  }

}


/** mine */
export const msgApi = {
  unreadList: (params: Recordable) => {
    return http.get<PagesResult<Message[]>>({ url: "/mine/message/unread", params })
  },
  remove: (msgType: MessageType, ids: string) => {
    return http.delete({ url: `/mine/${msgType}/${ids}` })
  },

  unreadCount: (msgType: MessageType | 'all' = 'all') => {
    return http.get({ url: `/mine/${msgType}/unread_count` })
  },
  read: (msgType: MessageType | 'all', id: string) => {
    return http.put({ url: `/mine/${msgType}/read/${id}` })
  },
  readAll: (msgType: MessageType | 'all') => {
    return http.put({ url: `/mine/${msgType}/read_all` })
  },
  clear: (msgType: MessageType) => {
    return http.delete({ url: `mine/${msgType}/clear` })
  }
}

/**file manage */
export const fileApi = {

  index: (params: Recordable) => {
    return http.get<PagesResult<FileInfo[]>>({ url: "/file", params })
  },
  create: (data: Recordable, onProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    return http.postFormData({ url: "/file", data, onUploadProgress: onProgress })
  },
  remove: (ids: string) => {
    return http.delete({ url: `/file/${ids}` })
  },
  category: (params?: Recordable) => {
    return http.get<TagOption[]>({ url: "/file/category", params })
  },
  // categoryCreate: (params:Recordable)=>{
  //   return http.post({url: "/file/category", data:params})
  // },
  // categoryEdit: (params: Recordable)=>{
  //   return http.put({ url: `/file/category`,data:params})
  // },
  categorySave: (params: Recordable) => {
    return http.post({ url: "/file/category", data: params })
  },
  categoryRemove: (ids: string) => {
    return http.delete({ url: `/file/category/${ids}` })
  }

}


//获取api列表
export function apis() {
  return http.get<TreeSelectOption[]>({ url: '/tree' });
}

//获取字典参数
export function options<T = number>(dictCode: string) {
  return http.get<OptionWithKey<T>[]>({ url: '/dictItem/options', params: { code: dictCode } });
}

//upload
export function uploadApi(params: UploadFileParams, config?: AxiosRequestConfig) {
  if (!config) config = { url: '/upload' }
  config.url = config.url ?? '/upload'
  return http.uploadFile(config, params)
}
export function postFormData(config: AxiosRequestConfig) {
  config.url = config.url ?? '/upload'
  return http.postFormData(config)
}