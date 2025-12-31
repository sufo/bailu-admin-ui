/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-05-17 12:18:59
 * @Desc: 
 */


export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh-CN',
  EN_US: 'en'
}

export const localeSetting: LocaleSetting = {
  visible: true,

  locale: LOCALE.ZH_CN,

  fallback: LOCALE.ZH_CN,

  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US]
}

export const localeList: { value: LocaleType, label: string }[] = [
  { value: LOCALE.ZH_CN, label: '简体中文' },
  { value: LOCALE.EN_US, label: 'English' }
]