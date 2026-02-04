//@ts-ignore
import { ACCESS_TOKEN, USER_INFO, REFRESH_TOKEN } from '@/constants/consts';
import storage from '@/utils/storage';
import { DEFAULT_CACHE_TIME } from "@/utils/storage"
import { defineStore } from 'pinia';
import { store } from "@/store"
import { getUserInfo, login, smsLogin, logoutApi, register } from '@/api/admin'



import { rsa } from '@/utils/rsa'





/**
 * 注意 state里面的属性名和getters里面的属性名不能相同 
 *  https://github.com/vuejs/pinia/pull/1356
 * 
 *  getters  类似computed
 *  1、推荐使用箭头函数 （箭头函数可以推断返回类型）
 *  2、如果函数内部要使用this，则要采用普通函数定义方式，否则报错：Object is possibly 'undefined'
 *  3、常规函数定义时，需要指定返回值类型，因为无法推断
 *  4、如果要传值，则使用高阶函数
 *  
 * pinia中 只用使用state中的属性值，不是响应式的，可以有两种方式实现响应式：
 *  1、getters中定义state属性对应的方法，使用的时候直接通过getters里面的方法获取值
 *  2、通过storeToRefs(xxxstore)得到的就是响应式的;
 * 
 *  这里依赖服务端实现续期，所以前端不需要实现刷新token
 * 
 */
export const useUserStore = defineStore('app-user', {
  //为了完整类型推理，推荐使用箭头函数
  state: (): UserState => ({

    userInfo: null,

    token: "",

    //有效期
    expires: DEFAULT_CACHE_TIME,

    // refreshToken: "",

    lastUpdTime: 0
  }),

  getters: {
    //为了完整类型推理，推荐使用箭头函数
    getUserInfo: state => state.userInfo || storage.get<UserInfo>(USER_INFO),

    //当使用this的时候，必须准确地设置返回值的类型
    userId(): string | number { return this.getUserInfo?.id || "" },

    getToken: state => {

      // console.log("state.token",state.token)
      // console.log("storage.token",storage.get<string>(ACCESS_TOKEN))
      return state.token || storage.get<string>(ACCESS_TOKEN) || ""
    },

    // getRefreshToken: state => state.refreshToken || storage.get<string>(REFRESH_TOKEN) || "",
    roleList: state => state.userInfo?.roles,

    // 页面刷新获取为空
    // permissionList: state =>  //state.userInfo?.permissions||[]
    permissionList(): string[] {
      return this.getUserInfo?.permissions.filter(item => !!item) || []
    }
  },

  actions: {

    setExpires(expires: number) {
      this.expires = expires
    },

    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdTime = new Date().getTime()
      storage.set(USER_INFO, info)
    },
    setAvatar(avatar: string) {
      this.userInfo!.avatar = avatar
      storage.set(USER_INFO, this.userInfo)
    },

    setToken(token: string) {
      this.token = token ?? ""
      storage.set(ACCESS_TOKEN, token, this.expires)
    },

    async logout() {
      // if (this.getToken) { //没有响应式
      if (this.token || storage.get<string>(ACCESS_TOKEN)) {
        //注销操作
        try {
          await logoutApi();
        } catch {
          // const t = i18n.global.t
          console.log('logout error');
        }
      }
      this.setToken('');
      this.setUserInfo(null);
      storage.removes(ACCESS_TOKEN, USER_INFO)
    },

    //登录
    async doLogin(params: LoginParams,): Promise<void> {
      try {
        params.password = rsa.encryptByPublicKey(params.password) as string
        //网络请求 获取userinfo和token
        const { token, userInfo, expires } = await login(params)
        this.expires = expires
        this.setToken(token!);
        this.setUserInfo(userInfo);
      } catch (error) {
        return Promise.reject(error)
      }
    },


    //根据token获取用户信息 
    async reqUserInfo(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo()
      this.setUserInfo(userInfo)
      return userInfo
    },

    //登录
    async smsLogin(phone: string, smsCode: string): Promise<UserInfo | null> {
      try {
        //网络请求 获取userinfo和token
        const { token, userInfo, expires } = await smsLogin(phone, smsCode)
        this.expires = expires
        this.setToken(token!);
        this.setUserInfo(userInfo);
        return userInfo
      } catch (error) {
        return Promise.reject(error)
      }
    },

    //注册
    async register(params: RegisteParams): Promise<unknown> {
      try {
        //网络请求 获取userinfo和token
        await register(params)
        // //注册成功跳转到登录页面
        // const { router } = await import('@/router');
        // await router.replace(Page.BASE_LOGIN)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 这里依赖服务端实现续期，所以前端不需要实现刷新token
    // async refreshAccessToken() {
    //   const token = storage.get(ACCESS_TOKEN)
    //   const refreshToken = storage.get(REFRESH_TOKEN)
    //   if (!token && !refreshToken) {
    //     return
    //   }
    //   const { time } = tokenItem
    //   if (new Date().getTime() - time > 1000 * 60 * 30) {
    //     try {
    //       const res = await refreshToken()
    //       if (res.code === 0) {
    //         setToken(res.data.token)
    //       }
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   }
    // }
  }
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
