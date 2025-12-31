import { computed } from 'vue';

import { usePreferenceStore } from '@/store/modules';

export function useTabSetting() {
  const themeStore = usePreferenceStore();

  const showTab = computed(() => themeStore.getTabSetting.visible);

  const showQuick = computed(() => themeStore.getTabSetting.showQuick);

  const showRedo = computed(() => themeStore.getTabSetting.showRedo);

  const showFull = computed(() => themeStore.getTabSetting.showFull);


  function setTabSetting(tabsSetting: Partial<Tab>) {
    themeStore.setProjectSetting({ tab: tabsSetting });
  }
  return {
    setTabSetting,
    showTab,
    showQuick,
    showRedo,
    showFull,
  };
}
