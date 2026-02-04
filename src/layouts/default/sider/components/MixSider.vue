<!---左侧菜单混合模式-->
<template>
  <dark-mode-container :class="prefixCls" class="flex h-full" :inverted="preference.menu.inverted" @mouseleave="resetFirstDegreeMenus">
    <div class="flex-1-hidden flex-col-stretch h-full">
      <app-logo v-if="preference.app.showLogo" :show-title="false" :class="`${prefixCls}-logo`" />
      <n-scrollbar class="flex-1-hidden">
        <mix-menu-item
          v-for="item in firstLevelMenus"
          :key="item.routeName"
          :route-name="item.routeName"
          :active-route-name="activeParentRouteName"
          :label="item.label"
          :icon="item.icon"
          :is-mini="app.siderCollapse"
          @click="handleMixMenu(item.routeName, item.hasChildren)"
        />
      </n-scrollbar>
      <!--菜单底部折叠/展开箭头图标按钮-->
      <n-button :text="true" class="h-36px" @click="app.toggleSiderCollapse">
        <icon icon="ph-caret-double-right-bold" v-if="app.siderCollapse" class="text-16px" />
        <icon icon="ph-caret-double-left-bold" v-else class="text-16px" />
      </n-button>
    </div>
    <mix-menu-drawer :mixSideWidth="mixSideWidth" :visible="drawerVisible" :menus="activeChildMenus" />
  </dark-mode-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore,useAsyncRouteStore,usePreferenceStore } from '@/store/modules';
import { useBoolean,useDesign} from '@/hooks';
import { useRouterPush} from '@/hooks/common/usePage';
import MixMenuDrawer from './MixMenuDrawer.vue'
import MixMenuItem from './MixMenuItem.vue';
defineOptions({ name: 'VerticalMixSider' });

const route = useRoute();
const app = useAppStore();
const preference = usePreferenceStore();
const routeStore = useAsyncRouteStore();
const { routerPush } = useRouterPush();
const { bool: drawerVisible, setTrue: openDrawer, setFalse: hideDrawer } = useBoolean();

const {prefixCls} = useDesign('vertical-mix-sider')

const mixSideWidth = computed(() => {
  const menuSetting = preference.getMenuSetting
  return app.siderCollapse ? menuSetting.mixCollapsedWidth : menuSetting.collapsedWidth;
});

const activeParentRouteName = ref('');
function setActiveParentRouteName(routeName: string) {
  activeParentRouteName.value = routeName;
}

const firstLevelMenus = computed(() =>
  //@ts-ignore
  routeStore.menus.map(item => {
    const { routeName, name } = item;
    const icon = item?.icon;
    const hasChildren = Boolean(item.children && item.children.length);
    return {
      routeName,
      label: name,  //已经处理过国际化
      icon,
      hasChildren
    };
  })
);

function getActiveParentRouteName() {
  firstLevelMenus.value.some(item => {
    const routeName = (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string;
    const flag = routeName?.includes(item.routeName);
    if (flag) {
      setActiveParentRouteName(item.routeName);
    }
    return flag;
  });
}

function handleMixMenu(routeName: string, hasChildren: boolean) {
  setActiveParentRouteName(routeName);
  if (hasChildren) {
    openDrawer();
  } else {
    routerPush({ name: routeName });
  }
}

function resetFirstDegreeMenus() {
  getActiveParentRouteName();
  hideDrawer();
}

const activeChildMenus = computed(() => {

  const menus: App.Menu[] = [];
  routeStore.menus.some(item => {
    const flag = item.routeName === activeParentRouteName.value && Boolean(item.children?.length);
    if (flag && item.children) {
      menus.push(...item.children);
    }
    return flag;
  });
  return menus;
});

watch(
  () => route.name,
  () => {
    getActiveParentRouteName();
  },
  { immediate: true }
);
</script>

<style lang="scss">
// @prefix: ~'@{namespace}-vertical-mix-sider';
// .@{prefix} {
$prefix: '#{$namespace}-vertical-mix-sider';
.#{$prefix} {
  &-logo{height: $header-height;}
}
</style>
