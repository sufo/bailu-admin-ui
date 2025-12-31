<template>
  <tool-tip class="w-36 h-30" :tooltip-content="$t('layout.tabs.reload')" placement="bottom-end" @click="handleRefresh">
    <icon icon="mdi:refresh" :size="22" :spin="loading" />
  </tool-tip>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAppStore,useTabStore } from '@/store/modules';
import { useLoading } from '@/hooks';
defineOptions({ name: 'ReloadButton' });

const app = useAppStore();
const route = useRoute();
const tabStore = useTabStore();
const { loading, startLoading, endLoading } = useLoading();

function handleRefresh() {
  const isCached = tabStore.getCachePages.includes(String(route.name));
  if (isCached) {
    tabStore.removeCacheRoute(route.name as string);
  }
  startLoading();
  app.reloadPage();
  setTimeout(() => {
    if (isCached) {
      tabStore.addCacheRoute(route.name as string);
    }
    endLoading();
  }, 1000);
}
</script>

<style scoped></style>
