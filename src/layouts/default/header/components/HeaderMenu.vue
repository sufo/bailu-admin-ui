<!--
 * 
 * @Desc: 
-->
<template>
  <div class="flex-1-hidden h-full px-10px">
    <n-scrollbar :x-scrollable="true" class="flex-1-hidden h-full" content-class="h-full">
      <div class="flex-y-center h-full" :style="{ justifyContent: theme.menu.topMenuAlign }">
        <n-menu
          :value="activeKey"
          mode="horizontal"
          :options="menus"
          :inverted="theme.header.inverted"
          @update:value="handleUpdateMenu"
        />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePreferenceStore, useAsyncRouteStore } from '@/store/modules';
import { useRouterPush } from '@/hooks/common/usePage';

defineOptions({ name: 'HeaderMenu' });

const route = useRoute();
const routeStore = useAsyncRouteStore();
const theme = usePreferenceStore();
const { routerPush } = useRouterPush();

const menus = routeStore.getMenus;
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);

function handleUpdateMenu(_key: string, item: App.Menu) {
  routerPush(item.path);
}
</script>

<style scoped>
:deep(.n-menu-item-content-header) {
  overflow: inherit !important;
}
</style>
