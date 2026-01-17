import { useEventListener } from '@vueuse/core';
import { useTabStore, usePreferenceStore } from '@/store/modules';


/** 全局事件 */
export function useGlobalEvents() {
  const theme = usePreferenceStore();
  const tab = useTabStore();

  /** 页面离开时缓存多页签数据 */
  useEventListener(window, 'beforeunload', () => {
    theme.cacheThemeSettings();
    tab.storeTabs();
  });

}
