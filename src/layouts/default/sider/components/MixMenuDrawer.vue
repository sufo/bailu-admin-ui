<template>
  <div class="relative h-full transition-width duration-300 ease-in-out" :class="prefixCls" 
  :style="{ width: app.mixSiderFixed ? theme.menu.mixChildMenuWidth + 'px' : '0px' }">
  <dark-mode-container :inverted="theme.menu.inverted"
    class="absolute-lt flex-col-stretch nowrap-hidden h-full"
    :style="getMenuStyle">
      <div :class="`${prefixCls}__title`" class="flex-y-center justify-between">
        <h2 class="text-primary pl-8px text-16px font-bold whitespace-nowrap">{{ title }}</h2>
        <div class="px-8px text-16px text-gray-600 cursor-pointer" @click="app.toggleMixSiderFixed">
          <Icon :size="16"
          :icon="app.mixSiderFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"/>
        </div>
      </div>
      <n-scrollbar class="flex-1-hidden">
        <n-menu
          :value="activeKey"
          :options="menus"
          :expanded-keys="expandedKeys"
          :indent="18"
          :inverted="!theme.isDark && menuSetting.inverted"
          @update:value="handleUpdateMenu"
          @update:expanded-keys="handleUpdateExpandedKeys"
        />
      </n-scrollbar>
    </dark-mode-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { useAppStore, usePreferenceStore } from '@/store/modules';
// import { getActiveKeyPathsOfMenus } from '../useSider';
import {useDesign} from '@/hooks'
import {useRouterPush} from '@/hooks/common/usePage'
import type {CSSProperties} from 'vue'

defineOptions({ name: 'MixMenuDrawer' });

interface Props {
  /** 菜单抽屉可见性 */
  visible: boolean;
  /**mix sidebar with */
  mixSideWidth: number,
  /** 子菜单数据 */
  menus: App.Menu[];
}

const props = defineProps<Props>();

const route = useRoute();
const app = useAppStore();
const theme = usePreferenceStore();
const { routerPush } = useRouterPush();
const title = import.meta.env.VITE_APP_TITLE

const { prefixCls } = useDesign('mix-menu-drawer');

const showDrawer = computed(() => (props.visible && props.menus.length) || app.mixSiderFixed);
const menuSetting = theme.getMenuSetting
const getMenuStyle = computed((): CSSProperties => {
  return {
    width: unref(showDrawer) ? `${unref(menuSetting.mixChildMenuWidth)}px` : 0,
    // left: `${props.mixSideWidth}px`,
  };
});
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const expandedKeys = ref<string[]>([]);

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as App.Menu;
  routerPush(menuItem.path);
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

watch(
  () => route.name,
  () => {
    // expandedKeys.value = getActiveKeyPathsOfMenus(activeKey.value, props.menus);
    const matched = route.matched
    expandedKeys.value = matched?route.matched.map(item=>item.name) as string[]:[]
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
// @prefix: ~'@{namespace}-mix-menu-drawer';
// .@{prefix} {
$prefix: '#{$namespace}-mix-menu-drawer';
.#{$prefix} {
  &__title{
    height: $header-height;
  }

  >div {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  }
}

</style>
