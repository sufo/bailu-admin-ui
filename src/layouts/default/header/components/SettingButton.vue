<!--
 * 
 * @Desc: 
-->
<template>
  <tool-tip
    class="w-40px h-full"
    :tooltip-content="$t('preference.drawerTitle')"
    :inverted="theme.header.inverted"
    @click="app.toggleSettingDrawerVisible">
    <icon icon="ion:settings-outline" size="18"  />
  </tool-tip>
</template>

<script setup lang="ts">
import { usePreferenceStore } from '@/store/modules';
import { useAppStore } from '@/store/modules';
defineOptions({ name: 'SettingButton' });

const theme = usePreferenceStore();
const app = useAppStore()
</script>

<style scoped></style>
