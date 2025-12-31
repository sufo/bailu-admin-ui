/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-06 11:25:10
 * @Desc: 
 */
import { LOCALE_KEY } from "@/constants/consts";
import storage from "@/utils/storage";
import { localeSetting } from '@/settings/localeSetting'
import { defineStore } from "pinia";
import { store } from "../index";

const localeConf = storage.get<LocaleSetting>(LOCALE_KEY, localeSetting)

interface LocaleState {
  localInfo: LocaleSetting;
}

const useLocaleStore = defineStore("app-locale-store", {
  state: (): LocaleState => ({
    localInfo: localeConf!
  }),
  getters: {
    isVisible(state) {
      return state.localInfo.visible
    },

    getLocale(state) {
      return state.localInfo?.locale ?? 'zh-CN'
    },

    getLocaleInfo(state) {
      return state.localInfo
    }

  },

  actions: {
    /**
     * Set up multilingual information and cache
     * @param info multilingual info
     */
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localInfo = { ...this.localInfo, ...info }
      storage.set(LOCALE_KEY, this.localInfo)
    },

    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localInfo
      })
    }
  }
})


function useLocaleStoreWithOut() {
  return useLocaleStore(store)
}

export {
  useLocaleStore, useLocaleStoreWithOut
}