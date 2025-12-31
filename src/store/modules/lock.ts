import { LOCK_INFO_KEY } from "@/constants/consts";
import { storage } from '@/utils/storage'
import { unLock } from '@/api/admin'
import { rsa } from "@/utils/rsa";
import { useUserStore } from "./user";
interface LockInfo {
  isLock: boolean
}
export const useLockStore = defineStore('app-lock-store', {
  state: () => ({
    lockInfo: storage.get<LockInfo>(LOCK_INFO_KEY, { isLock: false })
  }),
  getters: {
    getLockInfo(state): LockInfo {
      return state.lockInfo
    }
  },
  actions: {
    setLockInfo(info: LockInfo) {
      console.log(info)
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      storage.set(LOCK_INFO_KEY, { ...this.lockInfo });
    },
    resetLockInfo() {
      storage.remove(LOCK_INFO_KEY);
      this.lockInfo.isLock = false;
    },
    // Unlock
    async unLock(username: string, password: string): Promise<LockInfo | undefined> {
      try {
        password = rsa.encryptByPublicKey(password) as string
        //网络请求 获取userinfo和token
        const res = await unLock(username, password)
        if (res) {
          const { token, userInfo, expires } = res
          const userStore = useUserStore()
          userStore.setExpires(expires)
          userStore.setToken(token!)
          userStore.setUserInfo(userInfo)
          this.resetLockInfo()
          return this.lockInfo
        }
        return this.lockInfo
      } catch (error) {
        // console.log("error" ,error)
        //注意要加return 
        return Promise.reject(error)
      }
    },
  },



})