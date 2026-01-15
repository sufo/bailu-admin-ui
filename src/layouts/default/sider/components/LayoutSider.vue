<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 16:37:20
 * @Desc: 
-->
<!---左侧菜单模式-->
<template>
  <dark-mode-container v-bind="$attrs" :class="prefixCls" class="flex-col-stretch h-full" :inverted="preference.menu.inverted">
    <app-logo v-if="!isHorizontalMix && preference.app.showLogo" :show-title="showTitle" :class="`${prefixCls}-logo`"/>
    <n-scrollbar class="flex-1-hidden">
      <n-menu
        :value="activeKey"
        :collapsed="app.siderCollapse"
        :collapsed-width="preference.menu.collapsedWidth"
        :collapsed-icon-size="22"
        :options="menus"
        :expanded-keys="expandedKeys"
        :indent="18"
        :inverted="!preference.isDark && preference.menu.inverted"
        @update:value="handleUpdateMenu"
        @update:expanded-keys="handleUpdateExpandedKeys"/>
  </n-scrollbar>
  </dark-mode-container>
  <drag-bar :max-width="800"
    :min-width="preference.menu.collapsedWidth"
    :can-drag="preference.menu.canDrag"
    :left="preference.menu.width" :mobile="isMobile"/>
</template>
<script lang="ts" setup>
import { useDesign,useRouterPush} from '@/hooks';
import { useAppStore, usePreferenceStore,useAsyncRouteStore } from '@/store/modules';
import { useContext } from '@/store/useContext'
// import { getActiveKeyPathsOfMenus } from '../useSider';
import type { MenuOption } from 'naive-ui';

defineOptions({ name: 'VerticalSider' });


const {prefixCls} = useDesign('vertical-sider')
const { isMobile } = storeToRefs(useContext())
const preference = usePreferenceStore()
const app = useAppStore()
const route = useRoute();
const routeStore = useAsyncRouteStore();
const { routerPush } = useRouterPush();


const isHorizontalMix = computed(() => preference.layout.mode === 'horizontal-mix');
const showTitle = computed(() => !app.siderCollapse && preference.layout.mode !== 'vertical-mix');


const menus = computed(() => routeStore.getMenus);
// console.log("menus ", menus.value)

// const activeKey = computed(() => ( route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const expandedKeys = ref<string[]>([]);

function handleUpdateMenu(_key: string, item: MenuOption) {
  debugger
  const menuItem = item as App.Menu;
  routerPush(menuItem.path);
  if(isMobile.value){
    app.setSiderCollapse(true)  //关闭drawer
  }
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

watch(
  () => route.name,
  () => {
    // console.log("watch matched",route.matched);
    // expandedKeys.value = getActiveKeyPathsOfMenus(activeKey.value, menus.value);
    //route.matched当前打开菜单
    const matched = route.matched
    expandedKeys.value = matched?route.matched.map(item=>item.name) as string[]:[]
  },
  { immediate: true }
);


</script>
<style lang="scss">
// @prefix: ~'@{namespace}-vertical-sider';
// .@{prefix} {
$prefix: '#{$namespace}-vertical-sider';
.#{$prefix} {
  position: relative;
  &-logo{height: $header-height;justify-content:center;}
}
</style>