/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-06-06 12:34:40
 * @Desc: 当前应用设置
 */
import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import {
  initThemeSetting, setThemeSettings,
  getNaiveThemeOverrides, clearThemeSettings
} from './helper'
import { deepMerge } from "@/utils/util"
import { store } from "@/store"
import { usePreferredColorScheme } from '@vueuse/core'
import { colord } from 'colord'

export const usePreferenceStore = defineStore('app-setting-store', {
  state: (): Settings => initThemeSetting(),
  getters: {
    /** naiveUI的主题配置 */
    naiveThemeOverrides(state) {
      const overrides = getNaiveThemeOverrides({ primary: state.theme.themeColor, ...state.theme.otherColor });
      return overrides;
    },

    /** naive-ui主题 */
    naiveTheme(state) {
      return state.theme.mode === 'dark' ? darkTheme : undefined;
    },

    transitionMode(state) {
      return state.transition.enable ? state.transition.animateMode : undefined
    },

    //获取项目配置
    getSetting(state): Settings {
      return state
    },

    getTheme(state): ThemePreference {
      return state.theme
    },

    getApp(state): AppPreference {
      return state.app
    },

    //Layout配置
    getLayoutSetting(state): Layout {
      return state.layout
    },
    //header配置
    getHeaderSetting(state): Header {
      return state.header
    },
    footerSetting(state): Footer {
      return state.footer
    },

    getMenuSetting(state): Menu {
      return state.menu
    },

    getTabSetting(state): Tab {
      return state.tab
    },

    isDark(state): boolean {
      const osTheme = usePreferredColorScheme();
      if (state.theme.mode === 'auto') {
        return osTheme.value === 'dark';
      }
      return state.theme.mode === 'dark'
    },

    /**
     * 是否深主题色
     */
    isDarkPrimaryColor: (state) => {
      return colord(state.theme.themeColor).isDark()
    },
    // isFullContent(state): boolean {
    //   return state.fullContent
    // },

    isVerticalMenu(state): boolean {
      return state.theme.mode.includes('vertical')
    },

    //布局/导航模式
    layoutMode(state): LayoutMode {
      return this.getLayoutSetting.mode
    }
  },

  actions: {
    /** 重置theme状态 */
    resetThemeStore() {
      clearThemeSettings();
      this.$reset();
    },
    /** 缓存主题配置 */
    cacheThemeSettings() {
      const isProd = import.meta.env.PROD;
      if (isProd) {
        setThemeSettings(this.$state);
      }
    },
    // cacheThemeSettings() {
    //   setThemeSettings(this.$state);
    // },

    // /** 设置暗黑模式 */
    // setDarkMode(darkMode: boolean) {
    //   this.darkMode = darkMode;
    //   this.setProjectSetting({ darkMode })
    // },
    // /** 设置自动跟随系统主题 */
    // setFollowSystemTheme(val: boolean) {
    //   this.followSystemTheme = val;
    // },

    /** 自动跟随系统主题 */
    setAutoFollowSystemMode(themeMode: Omit<ThemeModeType, 'auto'> | null) {
      if (this.theme.mode == 'auto') {
        this.theme.mode = themeMode as ThemeModeType;
      }
    },

    setThemeMode(mode: ThemeModeType) {
      this.theme.mode = mode
    },
    setIsDark(isDark: boolean) {
      this.theme.mode = isDark ? 'dark' : 'light'
    },

    setAppPreference(appPreference: DeepPartial<AppPreference>) {
      this.app = deepMerge(this.app || {}, appPreference);
    },

    setThemePreference(themePreference: DeepPartial<ThemePreference>) {
      this.theme = deepMerge(this.theme || {}, themePreference);
    },
    setLayoutPreference(layout: DeepPartial<Layout>) {
      this.layout = deepMerge(this.layout || {}, layout);
    },

    setHeaderInverted(isVal: boolean) {
      this.header.inverted = isVal
    },
    setSiderInverted(isVal: boolean) {
      this.menu.inverted = isVal
    },
    setFooterInverted(isVal: boolean) {
      this.footer.inverted = isVal
    },
    setThemeColor(colorPrimary: string) {
      this.theme.themeColor = colorPrimary
    },
    setHeaderSetting(headerSetting: DeepPartial<Header>): void {
      this.header = deepMerge(this.header || {}, headerSetting);
    },
    setMenuSetting(menuSetting: DeepPartial<Menu>): void {
      this.menu = deepMerge(this.menu || {}, menuSetting);
    },
    setFooterSetting(footerSetting: DeepPartial<Footer>): void {
      this.footer = deepMerge(this.footer || {}, footerSetting);
    },
    setTabSetting(tabSetting: DeepPartial<Tab>): void {
      this.tab = deepMerge(this.tab || {}, tabSetting);
    },
    setCrumbSetting(crumbSetting: DeepPartial<Crumb>): void {
      this.crumb = deepMerge(this.crumb || {}, crumbSetting);
    },
    setTransition(transition: DeepPartial<Transition>): void {
      this.transition = deepMerge(this.transition || {}, transition);
    },

    setProjectSetting(setting: DeepPartial<Settings>): void {
      // console.log("setting", setting)
      this.$state = deepMerge(this.$state || {}, setting);
      // console.log("state", this.$state)
    },

  }

})

export default usePreferenceStore

// Need to be used outside the setup
export function usePrefernceStoreWidthOut() {
  return usePreferenceStore(store);
}