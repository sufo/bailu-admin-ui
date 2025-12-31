import { computed, onUnmounted, unref, watchEffect } from 'vue';
import { useThrottleFn } from '@vueuse/core';

import { usePreferenceStore, useLockStore, useUserStore } from '@/store/modules';

export function useLockPage() {
  const theme = usePreferenceStore();
  const lockStore = useLockStore();
  const userStore = useUserStore();

  const lockTime = computed(() => theme.lockTime)
  let timeId: TimeoutHandle;

  function clear(): void {
    window.clearTimeout(timeId);
  }

  function resetCalcLockTimeout(): void {
    // not login
    if (!userStore.getToken) {
      clear();
      return;
    }
    if (!lockTime.value || lockTime.value < 1) {
      clear();
      return;
    }
    clear();

    timeId = setTimeout(() => {
      lockPage();
    }, lockTime.value * 60 * 1000);
  }

  function lockPage(): void {
    lockStore.setLockInfo({
      isLock: true,
    });
  }

  watchEffect((onClean) => {
    if (userStore.getToken) {
      resetCalcLockTimeout();
    } else {
      clear();
    }
    onClean(() => {
      clear();
    });
  });

  onUnmounted(() => {
    clear();
  });

  const keyupFn = useThrottleFn(resetCalcLockTimeout, 2000);

  return computed(() => {
    if (unref(lockTime)) {
      return { onKeyup: keyupFn, onMousemove: keyupFn };
    } else {
      clear();
      return {};
    }
  });
}
