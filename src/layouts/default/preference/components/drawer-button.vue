<template>
  <n-button
    type="primary"
    :class="[{ '!right-360px': app.settingDrawerVisible }, app.settingDrawerVisible ? 'ease-out' : 'ease-in']"
    class="fixed top-360px right-14px z-10000 w-42px h-42px !p-0 transition-all duration-300"
    @click="app.toggleSettingDrawerVisible"
  >
    <icon icon="mdi:close" v-if="app.settingDrawerVisible" :size="24" />
    <icon icon="ion:settings-outline" v-else :size="24" />
  </n-button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules';

defineOptions({ name: 'DrawerButton' });

const app = useAppStore();
</script>

<style scoped></style>
