<template>
  <n-divider title-placement="center">{{ $t('preference.animation') }}</n-divider>
  <n-space vertical size="large">
    <setting-item :label="$t('preference.switchAnimation')">
      <n-switch :value="theme.transition.enable" @update:value="val=>theme.setTransition({enable:val})" />
    </setting-item>
    <setting-item :label="$t('preference.animationType')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.transition.animateMode"
        :options="animateModeOptions"
        @update:value="val=>theme.setTransition({animateMode:val})"
      />
    </setting-item>
  </n-space>
</template>
<script setup lang="ts">
import { usePreferenceStore } from '@/store/modules';
import {animateModeOptions} from '@/constants/options'
import SettingItem from './setting-item.vue';
defineOptions({name:"DTransition"})
const theme =  usePreferenceStore()

</script>
