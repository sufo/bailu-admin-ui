<!--
 * 
 * @Desc: 
-->
<template>
  <tool-tip class="w-40px theme-toggle" :inverted="preference.header.inverted" :tooltip-content="$t('common.themeMode')">
    <dark-mode-toggle :dark="preference.theme.mode=='dark'" class="wh-full" @update:dark="preference.setIsDark" />
  </tool-tip>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';

defineOptions({ name: 'ThemeMode' });

const preference = usePreferenceStore();
</script>

<style scoped></style>
