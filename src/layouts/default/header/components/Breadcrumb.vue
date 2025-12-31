<!--
 * 
 * @Desc: 
-->
<template>
  <n-breadcrumb class="px-12px">
    <template v-for="breadcrumb in breadcrumbs" :key="breadcrumb.key">
      <n-breadcrumb-item>
        <n-dropdown v-if="breadcrumb.hasChildren" :options="breadcrumb.options" @select="dropdownSelect">
          <span>
            <component
              :is="breadcrumb.icon"
              v-if="theme.crumb.showIcon"
              class="inline-block align-text-bottom mr-4px text-16px"
            />
            <span>{{ breadcrumb.i18nKey ? $t(breadcrumb.i18nKey) : breadcrumb.label }}</span>
          </span>
        </n-dropdown>
        <template v-else>
          <component
            :is="breadcrumb.icon"
            v-if="theme.crumb.showIcon"
            class="inline-block align-text-bottom mr-4px text-16px"
            :class="{ 'text-#BBBBBB': theme.header.inverted }"
          />
          <span :class="{ 'text-#BBBBBB': theme.header.inverted }">{{
            breadcrumb.i18nKey ? $t(breadcrumb.i18nKey) : breadcrumb.label
          }}</span>
        </template>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncRouteStore, usePreferenceStore } from '@/store/modules';
import { useRouterPush } from '@/hooks';
import { getBreadcrumbByRoute } from '@/utils/breadcrumb';

defineOptions({ name: 'Breadcrumb' });

const route = useRoute();
const theme = usePreferenceStore();
const routeStore = useAsyncRouteStore();
const { routerPush } = useRouterPush();

const breadcrumbs = computed(() =>
  // getBreadcrumbByRouteKey(route.name as string, routeStore.menus as App.Menu[], "/")
  //@ts-ignore
  getBreadcrumbByRoute(route, routeStore.menus)
);

function dropdownSelect(key: string) {
  routerPush({ name: key });
}
</script>

<style scoped></style>
