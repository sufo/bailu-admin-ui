
import { toRaw, ref, nextTick } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import { useDesign, useSortable } from '@/hooks';
import { useTabStore, usePreferenceStore } from '@/store/modules';
import { useRouter } from 'vue-router';

export function initAffixTabs(): string[] {
  const affixList = ref<RouteLocationNormalized[]>([]);

  const tabStore = useTabStore();
  const router = useRouter();
  /**
   * @description: Filter all fixed routes
   */
  function filterAffixTabs(routes: RouteLocationNormalized[]) {
    const tabs: RouteLocationNormalized[] = [];
    routes &&
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          tabs.push(toRaw(route));
        }
      });
    return tabs;
  }

  /**
   * @description: Set fixed tabs
   */
  function addAffixTabs(): void {
    const affixTabs = filterAffixTabs(router.getRoutes() as unknown as RouteLocationNormalized[]);
    affixList.value = affixTabs;
    for (const tab of affixTabs) {
      tabStore.addTab(tab, true);
    }
  }

  let isAddAffix = false;

  if (!isAddAffix) {
    addAffixTabs();
    isAddAffix = true;
  }
  return affixList.value.map((item) => item.meta?.title).filter(Boolean) as string[];
}

// export function useTabsDrag(affixTextList: string[]) {
export function useTabsDrag(dragableClass: string) {
  const tabStore = useTabStore();
  const { getTabSetting } = usePreferenceStore();
  const { prefixCls } = useDesign('layout-tabs');
  nextTick(() => {
    if (!getTabSetting.canDrag) return;

    const el = document.querySelectorAll(`.${prefixCls} .scroll-wrap > div`)?.[0] as HTMLElement;
    const { initSortable } = useSortable(el, {
      // filter: (e: ChangeEvent) => {
      //   // const text = e?.target?.innerText;
      //   // if (!text) return false;
      //   // return affixTextList.includes(text);
      //   // return e?.target?.classList.contains(filterClass)
      // },
      //使用filter会导致点击事件失效，并且无法完全禁止拖动交换的问题
      // filter: `.${filterClass}`,
      draggable: `.${dragableClass}`,
      onEnd: (evt: any) => {
        const { oldIndex, newIndex } = evt;

        if (isNullOrUnDef(oldIndex) || isNullOrUnDef(newIndex) || oldIndex === newIndex) {
          return;
        }

        tabStore.sortTabs(oldIndex, newIndex);
      },
      delay: 1000,
      fallbackTolerance: 10, // Specify in pixels how far the mouse should move before it's considered as a drag.
      forceFallback: true, //禁止使用HTML5原生拖拽
      dragoverBubble: true
    });
    initSortable();
  });
}

function isNullOrUnDef(o: any): boolean {
  return o === 'undefined' || o === null

}