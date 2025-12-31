// import type { Header } from '#/config';

import { computed } from 'vue';

import { usePreferenceStore } from '@/store/modules';

export function useHeaderSetting() {
  const themeStore = usePreferenceStore();

  const fixed = computed(() => themeStore.getHeaderSetting.fixed)
  const inverted = computed(() => themeStore.getHeaderSetting.inverted)
  const showFullScreen = computed(() => themeStore.getHeaderSetting.showFullScreen)
  const showNotice = computed(() => themeStore.getHeaderSetting.showNotice)
  const showSearch = computed(() => themeStore.getHeaderSetting.showSearch)
  const useLockPage = computed(() => themeStore.getHeaderSetting.useLockPage)
  const visible = computed(() => themeStore.getHeaderSetting.visible)

  function setTabSetting(headerSetting: Partial<Header>) {
    themeStore.setProjectSetting({ header: headerSetting });
  }
  return {
    setTabSetting,
    fixed,
    inverted,
    showFullScreen,
    showNotice,
    showSearch,
    useLockPage,
    visible
  };
}
