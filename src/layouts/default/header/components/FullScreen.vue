<!--
 * @version: 
 * 
 * @Desc: 
-->
<template>
  <tool-tip class="w-40px h-full" :tooltip-content="$t('button.fullscreen')" :inverted="theme.header.inverted" @click="toggle">
    <icon icon="gridicons-fullscreen-exit" v-if="isFullscreen" size="18" />
    <icon icon="gridicons-fullscreen" v-else size="18" />
  </tool-tip>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import { usePreferenceStore,useAppStore} from '@/store/modules';

defineOptions({ name: 'FullScreen' });

const { isFullscreen, toggle } = useFullscreen();
const theme = usePreferenceStore();
const appStore = useAppStore();
appStore.setFullScreen(isFullscreen.value);
</script>

<style scoped></style>
