<template>
  <tool-tip class="w-40px h-full" :inverted="theme.header.inverted" @click="app.toggleSiderCollapse">
    <icon icon="line-md:menu-unfold-left" v-if="app.siderCollapse" size="18" />
    <icon icon="line-md:menu-fold-left" v-else size="18" />
  </tool-tip>
</template>

<script lang="ts" setup>
import { useAppStore, usePreferenceStore } from '@/store/modules';

defineOptions({ name: 'MenuCollapse' });

const app = useAppStore();
const theme = usePreferenceStore();
</script>

<style scoped></style>
