import type { RouterScrollBehavior } from 'vue-router';

export const scrollBehavior: RouterScrollBehavior = (to, from) => {
  return new Promise(async resolve => {
    const { useAppStore } = await import('@/store/modules/app');
    const { useTabStore } = await import('@/store/modules/tabs');
    const app = useAppStore();
    const tab = useTabStore();

    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        resolve({
          el,
          behavior: 'smooth'
        });
      }
    }

    const { left, top } = tab.getTabScrollPosition(to.path);
    const scrollPosition = {
      left,
      top
    };
    const { scrollEle, scrollLeft, scrollTop } = app.getScrollConfig();

    const isFromCached = Boolean(from.meta.keepAlive);
    if (isFromCached) {
      tab.recordTabScrollPosition(from.path, { left: scrollLeft, top: scrollTop });
    }

    setTimeout(() => {
      if (scrollEle) {
        scrollEle.scrollLeft = scrollPosition.left;
        scrollEle.scrollTop = scrollPosition.top;
      }
    }, 400);
  });
};
