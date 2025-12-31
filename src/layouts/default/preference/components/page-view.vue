<template>
  <n-divider title-placement="center">{{ $t('preference.interfaceDisplay') }}</n-divider>
  <n-space vertical size="large">
    <setting-item :label="$t('preference.breadcrumb')">
      <n-switch :value="preference.crumb.visible" @update:value="val=>preference.setCrumbSetting({visible:val})" />
    </setting-item>
    <setting-item :label="$t('preference.breadcrumbIcon')">
      <n-switch :value="preference.crumb.showIcon" @update:value="val=>preference.setCrumbSetting({showIcon:val})" />
    </setting-item>
    <setting-item :label="$t('preference.tabs')">
      <n-switch :value="preference.tab.visible" @update:value="val=>preference.setTabSetting({visible:val})" />
    </setting-item>
    <setting-item :label="$t('preference.tabsStyle')">
      <n-select
        class="w-120px"
        size="small"
        :value="preference.tab.mode"
        :options="tabModeOptions($t)"
        @update:value="val=>preference.setTabSetting({mode:val})"
      />
    </setting-item>

    <setting-item :label="$t('preference.tabsRedoBtn')">
      <n-switch :value="preference.tab.showRedo" @update:value="val=>preference.setTabSetting({showRedo:val})" />
    </setting-item>
    <setting-item :label="$t('preference.tabsFullBtn')">
      <n-switch :value="preference.tab.showFull" @update:value="val=>preference.setTabSetting({showFull:val})" />
    </setting-item>

    <setting-item :label="$t('preference.sidebar')">
      <n-switch :value="preference.menu.visible" @update:value="val=>preference.setMenuSetting({visible:val})" :disabled="!preference.isVerticalMenu"/>
    </setting-item>
    <setting-item :label="$t('preference.header')">
      <n-switch :value="preference.header.visible" @update:value="val=>preference.setHeaderSetting({visible:val})" />
    </setting-item>
    <setting-item label="logo">
      <n-switch :value="preference.app.showLogo" @update:value="val=>preference.setAppPreference({showLogo:val})" />
    </setting-item>
    <setting-item :label="$t('preference.footer')">
      <n-switch :value="preference.footer.visible" @update:value="val=>preference.setFooterSetting({visible:val})" />
    </setting-item>
    <setting-item :label="$t('preference.footerFixed')">
      <n-switch :value="preference.footer.fixed" @update:value="val=>preference.setFooterSetting({fixed:val})" />
    </setting-item>
    <setting-item :label="$t('preference.footerAlignRight')">
      <n-switch :value="preference.footer.right" @update:value="val=>preference.setFooterSetting({right:val})" :disabled="preference.layoutMode!=='horizontal-mix'" />
    </setting-item>
    <setting-item :label="$t('preference.theme.grayMode')">
      <n-switch :value="preference.app.grayMode" @update:value="val=>preference.setAppPreference({grayMode:val})" />
    </setting-item>
    <setting-item :label="$t('preference.theme.colorWeak')">
      <n-switch :value="preference.app.colorWeak" @update:value="val=>preference.setAppPreference({colorWeak:val})" />
    </setting-item>
    <setting-item :label="$t('preference.dynamic-title')">
      <n-switch :value="preference.app.dynamicTitle" @update:value="val=>preference.setAppPreference({showWatermark:val})" />
    </setting-item>
    <setting-item :label="$t('preference.watermark')">
      <n-switch :value="preference.app.showWatermark" @update:value="val=>preference.setAppPreference({showWatermark:val})" />
    </setting-item>
  </n-space>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';
import SettingItem from './setting-item.vue';
import {tabModeOptions} from '@/constants/options'
defineOptions({ name: 'PageView' });

const preference = usePreferenceStore();
</script>

<style scoped></style>
