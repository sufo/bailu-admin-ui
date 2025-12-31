<template>
  <n-divider title-placement="center">{{$t('preference.interfaceFunction')}}</n-divider>
  <n-space vertical size="large">
    <!--
      滚动模式
      canDrag 侧边菜单拖拽
      header.showSearch   菜单搜索 
      header.fixed      固定头部
      多页签缓存
      顶部菜单布局
      自动锁屏
      菜单展开宽度
      固定底部
      底部居右
    -->
    <setting-item :label="$t('preference.scrollMode')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.app.scrollMode"
        :options="scrollModeOptions($t)"
        @update:value="val=>theme.setAppPreference({scrollMode:val})"
      />
    </setting-item>
    <setting-item :label="$t('preference.fixedHeader')">
      <n-switch :value="theme.header.fixed" @update:value="val=>theme.setProjectSetting({header:{fixed:val}})" />
    </setting-item>
    <setting-item :label="$t('preference.topMenuAlign')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.menu.topMenuAlign"
        :options="topMenuAlignOptions($t)"
        @update:value="val=>theme.setProjectSetting({menu:{topMenuAlign:val}})"
      />
    </setting-item>
    <setting-item :label="$t('preference.menuDrag')">
      <n-switch :value="theme.menu.canDrag" @update:value="val=>theme.setMenuSetting({canDrag:val})" />
    </setting-item>
    <setting-item :label="$t('preference.tabsCache')">
      <n-switch :value="theme.tab.persist" @update:value="val=>theme.setTabSetting({persist:val})" />
    </setting-item>
    <setting-item :label="$t('preference.expandedMenuWidth')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.menu.width"
        @update:value="(val:number)=>theme.setProjectSetting({menu:{width:val}})"
      />
    </setting-item>
    <setting-item :label="$t('preference.autoScreenLock')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.lockTime"
        :step="1"
        :parse="parse"
        :format="(value:number)=>value === 0
                ? `0${$t('preference.notAutoScreenLock')}`
                : `${value}${$t('preference.minute')}`"
        @update:value="(val:number)=>theme.setProjectSetting({lockTime:val})"
      />
    </setting-item>
    <setting-item :label="$t('preference.checkUpdate')">
      <n-switch :value="theme.app.enableCheckUpdate" @update:value="val=>theme.setAppPreference({enableCheckUpdate:val})" />
    </setting-item>

  </n-space>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';
import SettingItem from './setting-item.vue';
import {scrollModeOptions, topMenuAlignOptions} from '@/constants/options'
defineOptions({ name: 'PageFunc' });

const theme = usePreferenceStore();

function parse (input: string) {
  const nums = input.replace(/[^0-9]/ig,"").trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}
</script>

<style scoped></style>
