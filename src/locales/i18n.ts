
import en from './en.yaml'
import zhCN from './zh-CN.yaml'
import type { App } from 'vue'
import { createI18n, I18nOptions } from 'vue-i18n'
// import messages from '@intlify/vite-plugin-vue-i18n/messages'

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
// import messages from '@intlify/unplugin-vue-i18n/messages'
import { localeSetting, LOCALE } from '@/settings/localeSetting'
import storage from '@/utils/storage'
import { LOCALE_KEY } from '@/constants/consts'
// function getYaml() {
//   let x = import.meta.globEager("../locales/lang/*.y(a)?ml")
//   console.log(x)
// }

// getYaml()
//switch language
const { fallback, availableLocales } = localeSetting;
const localeInfo = storage.get<LocaleSetting>(LOCALE_KEY, localeSetting)

//设置html页面语言
export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

// export let i18n: ReturnType<typeof createI18n>;


function createI18nOptions(): I18nOptions {
  return {
    locale: localeInfo?.locale,
    //false to use composition api
    legacy: false,
    // If set to `true`, then properties and methods prefixed with `$` are injected into Vue Component.
    globalInjection: true,
    fallbackLocale: fallback,
    messages: {
      [LOCALE.ZH_CN]: zhCN,
      [LOCALE.EN_US]: en
    },
    availableLocales,
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  }
}

//这里暴露出去是为了在ts文件使用
//i18n.global.t("key.of.your.translation")
export const i18n = createI18n(createI18nOptions())
//Vue全局引入i18n
export function setupI18n(app: App) {
  setHtmlPageLang(localeInfo!.locale);
  // i18n = createI18n(createI18nOptions()) as I18n
  app.use(i18n)
}

//这里暴露出去是为了在ts文件使用
//i18n.global.t("key.of.your.translation")
// export default i18n

//ts或vue中使用
//import { useI18n } from 'vue-i18n'
//const {t} = useI18n({useScope:'global'})



// Why write this function？
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places
//此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用）,路由不需要提示可以删除
export const t = (key: string) => key;