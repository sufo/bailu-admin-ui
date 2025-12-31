/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-10-11 19:45:38
 * @Desc: 
 */
/**
 * Multi-language related operations
 */
import dayjs from 'dayjs';

import { i18n, setHtmlPageLang } from './i18n';
import { useLocaleStore } from '@/store/modules';
import { unref, computed } from 'vue';

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStore();
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  localeStore.setLocaleInfo({ locale });
  setHtmlPageLang(locale);
}

async function updateDayJsLocale(locale: LocaleType) {
  const localeStr = locale.toLowerCase().replace("_", "-").replace(/^en.*/, 'en')
  // const dayjsLocale = await import(`../../node_modules/dayjs/locale/${localeStr}.js`)
  // const dayjsLocale = await import('dayjs/locale/en')
  // dayjs.locale(locale, dayjsLocale);
  try {
    const module = await import(`../../node_modules/dayjs/esm/locale/${localeStr}.js`)
    dayjs.locale(localeStr, module.default)
  } catch (e) {
    console.error(`Failed to load language pack: ${localeStr}`, e);
  }
}
export function useLocale() {
  const localeStore = useLocaleStore();
  const getLocale = computed(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.isVisible);

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    //更新dayJS
    updateDayJsLocale(locale)

    setI18nLanguage(locale);
    return locale;
  }

  return {
    getLocale,
    getShowLocalePicker,
    changeLocale,
  };
}
